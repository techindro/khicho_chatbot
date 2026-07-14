import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Parse JSON bodies up to 10MB (for base64 image uploads)
app.use(express.json({ limit: "10mb" }));

// ─── RunwayML API Proxy ────────────────────────────────────────────────

const RUNWAY_API_KEY = process.env.RUNWAY_API_KEY;
const RUNWAY_BASE_URL = "https://api.dev.runwayml.com/v1";

/**
 * POST /api/runway/generate
 * Body: { prompt, imageBase64? (data URI), ratio? }
 * 
 * Submits a task to RunwayML, polls until done, returns the output URL.
 */
app.post("/api/runway/generate", async (req, res) => {
  if (!RUNWAY_API_KEY) {
    return res.status(500).json({ error: "RunwayML API key not configured on server" });
  }

  const { prompt, imageBase64, ratio = "1024:1024" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Step 1: Submit the task
    const taskBody = {
      model: "gen4_image",
      promptText: imageBase64 ? `${prompt} @ref` : prompt,
      ratio: ratio,
      referenceImages: imageBase64 ? [
        {
          uri: imageBase64,
          tag: "ref"
        }
      ] : [],
    };

    console.log(`[RunwayML] Submitting task: model=gen4_image, prompt="${taskBody.promptText.substring(0, 50)}...", hasImage=${!!imageBase64}`);

    const createRes = await fetch(`${RUNWAY_BASE_URL}/text_to_image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RUNWAY_API_KEY}`,
        "X-Runway-Version": "2024-11-06",
      },
      body: JSON.stringify(taskBody),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error(`[RunwayML] Task creation failed: ${createRes.status} ${errText}`);
      return res.status(createRes.status).json({ error: `RunwayML error: ${errText}` });
    }

    const taskData = await createRes.json();
    const taskId = taskData.id;
    console.log(`[RunwayML] Task created: ${taskId}`);

    // Step 2: Poll for completion (max 120 seconds)
    const maxPolls = 60;
    const pollInterval = 2000; // 2 seconds

    for (let i = 0; i < maxPolls; i++) {
      await new Promise((r) => setTimeout(r, pollInterval));

      const statusRes = await fetch(`${RUNWAY_BASE_URL}/tasks/${taskId}`, {
        headers: {
          "Authorization": `Bearer ${RUNWAY_API_KEY}`,
          "X-Runway-Version": "2024-11-06",
        },
      });

      if (!statusRes.ok) {
        console.error(`[RunwayML] Poll failed: ${statusRes.status}`);
        continue;
      }

      const statusData = await statusRes.json();
      console.log(`[RunwayML] Task ${taskId} status: ${statusData.status} (poll ${i + 1})`);

      if (statusData.status === "SUCCEEDED") {
        const outputUrl = statusData.output?.[0] || null;
        if (outputUrl) {
          return res.json({ success: true, url: outputUrl });
        }
        return res.status(500).json({ error: "Task succeeded but no output URL found" });
      }

      if (statusData.status === "FAILED") {
        return res.status(500).json({ error: statusData.failure || "RunwayML generation failed" });
      }

      // THROTTLED, PENDING, RUNNING → keep polling
    }

    return res.status(504).json({ error: "RunwayML task timed out after 120 seconds" });
  } catch (err) {
    console.error("[RunwayML] Server error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

// ─── Serve Vite-built frontend ─────────────────────────────────────────

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// SPA fallback: all non-API routes → index.html
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 Khicho.AI server running on http://localhost:${PORT}`);
  console.log(`   RunwayML API: ${RUNWAY_API_KEY ? "✅ Configured" : "❌ Missing RUNWAY_API_KEY"}`);
});
