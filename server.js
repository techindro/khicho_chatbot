import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "50mb" }));

const RUNWAY_KEY = process.env.RUNWAY_API_KEY;
const RUNWAY_URL = "https://api.dev.runwayml.com/v1";

app.post("/api/runway/generate", async (req, res) => {
  if (!RUNWAY_KEY) {
    return res.status(500).json({ error: "Runway key not found on server" });
  }

  const { prompt, imageBase64, ratio = "1024:1024" } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const finalPrompt = imageBase64 
      ? `a detailed portrait photo of @ref, styled as: ${prompt}, preserving the exact facial features, hair, head pose, and expression of @ref`
      : prompt;

    const payload = {
      model: "gen4_image",
      promptText: finalPrompt,
      ratio,
      referenceImages: imageBase64 ? [{ uri: imageBase64, tag: "ref" }] : []
    };

    console.log(`[runway] generating: ${prompt.slice(0, 30)}...`);

    const initRes = await fetch(`${RUNWAY_URL}/text_to_image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RUNWAY_KEY}`,
        "X-Runway-Version": "2024-11-06"
      },
      body: JSON.stringify(payload)
    });

    if (!initRes.ok) {
      const err = await initRes.text();
      return res.status(initRes.status).json({ error: `Runway API error: ${err}` });
    }

    const task = await initRes.json();
    const taskId = task.id;

    // poll for task result (max 2 mins)
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 2000));

      const poll = await fetch(`${RUNWAY_URL}/tasks/${taskId}`, {
        headers: {
          "Authorization": `Bearer ${RUNWAY_KEY}`,
          "X-Runway-Version": "2024-11-06"
        }
      });

      if (!poll.ok) continue;

      const result = await poll.json();
      console.log(`[runway] status: ${result.status} (attempt ${i + 1})`);

      if (result.status === "SUCCEEDED") {
        const url = result.output?.[0];
        if (url) return res.json({ success: true, url });
        return res.status(500).json({ error: "Output URL empty" });
      }

      if (result.status === "FAILED") {
        return res.status(500).json({ error: result.failure || "Generation failed" });
      }
    }

    return res.status(504).json({ error: "Task timed out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/pollinations/generate", async (req, res) => {
  const { prompt, imageBase64, width = 512, height = 512, seed = 42 } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });
  console.log(`[pollinations] generating: ${prompt.slice(0, 40)}... hasImage=${!!imageBase64}`);

  try {
    let imageUrl = "";
    if (imageBase64) {
      try {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        const uploadForm = new FormData();
        const blob = new Blob([buffer], { type: "image/jpeg" });
        uploadForm.append("files[]", blob, "photo.jpg");

        const uploadRes = await fetch("https://qu.ax/upload.php", {
          method: "POST",
          body: uploadForm
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.success && uploadData.files?.[0]?.url) {
            imageUrl = uploadData.files[0].url;
            console.log(`[pollinations] uploaded reference to: ${imageUrl}`);
          }
        }
      } catch (uploadErr) {
        console.warn("Failed to upload reference to qu.ax:", uploadErr.message);
      }
    }

    const finalPrompt = imageBase64
      ? `a detailed portrait photo of the person, styled as: ${prompt}, preserving the exact facial features, hair, head pose, and expression of the person`
      : prompt;

    const baseUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}`;
    const queryParams = new URLSearchParams({
      width: width.toString(),
      height: height.toString(),
      seed: seed.toString(),
      nologo: "true",
      enhance: "true",
      model: "flux",
      nocache: Date.now().toString()
    });

    if (imageUrl) {
      queryParams.append("image", imageUrl);
    }

    const url = `${baseUrl}?${queryParams.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: `Pollinations error: ${err}` });
    }

    return res.json({ success: true, url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/download", async (req, res) => {
  const { url, filename = "download.jpg" } = req.query;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");

    const contentType = response.headers.get("content-type") || "image/jpeg";
    
    // Enforce clean .jpg or .png extension matching the image content type
    let cleanFilename = filename;
    if (contentType.includes("png")) {
      if (!cleanFilename.endsWith(".png")) {
        cleanFilename = cleanFilename.replace(/\.[^/.]+$/, "") + ".png";
      }
    } else {
      if (!cleanFilename.endsWith(".jpg") && !cleanFilename.endsWith(".jpeg")) {
        cleanFilename = cleanFilename.replace(/\.[^/.]+$/, "") + ".jpg";
      }
    }

    res.setHeader("Content-Disposition", `attachment; filename="${cleanFilename}"`);
    res.setHeader("Content-Type", contentType);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Download failed");
  }
});

// serve static build
const dist = path.join(__dirname, "dist");
app.use(express.static(dist));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
