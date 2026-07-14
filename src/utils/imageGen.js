const dataUrlFromBlob = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const compressImage = (blob, maxSize = 128) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.5));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
};

export const generateImageToImage = async (imageBlob, prompt, _hfToken, aspectRatio = "1:1") => {
  const thumbDataUrl = await compressImage(imageBlob, 128);

  try {
    const ratioStr = aspectRatio === "16:9" ? "1280:720" : 
                     aspectRatio === "9:16" ? "720:1280" : 
                     aspectRatio === "3:4" ? "768:1024" : 
                     aspectRatio === "4:5" ? "1024:1280" : "1024:1024";

    const res = await fetch("/api/runway/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, imageBase64: thumbDataUrl, ratio: ratioStr })
    });

    if (res.ok) {
      const data = await res.json();
      return data.url;
    }

    const errData = await res.json().catch(() => ({}));
    console.warn("Runway failed, using free fallback:", errData.error || res.statusText);
  } catch (err) {
    console.warn("Runway unavailable, using free fallback:", err.message);
  }

  // Free fallback: Pollinations.AI with compressed image guide
  const { width, height } = getSizes(aspectRatio);
  const seed = Math.floor(Math.random() * 999999);

  const res = await fetch("/api/pollinations/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, imageBase64: thumbDataUrl, width, height, seed })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Generation failed");
  }

  const data = await res.json();
  return data.url;
};

const getSizes = (ratio) => {
  if (ratio === "16:9") return { width: 768, height: 432 };
  if (ratio === "9:16") return { width: 432, height: 768 };
  if (ratio === "3:4")  return { width: 480, height: 640 };
  if (ratio === "4:5")  return { width: 512, height: 640 };
  return { width: 512, height: 512 };
};

const pollinationsUrl = (prompt, seed, w, h) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed}&nologo=true&enhance=true&model=flux&nocache=${Date.now()}`;

const checkImageUrl = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.src = "";
      reject(new Error("Timeout loading image"));
    }, 120000);

    img.onload = () => {
      clearTimeout(timer);
      resolve(url);
    };

    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

export const generateImage = async (prompt, index = 0, currentTier = "Free", ideogramApiKey = "", aspectRatio = "1:1") => {
  if (currentTier !== "Free" && ideogramApiKey) {
    try {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const endpoint = isLocal ? "/api-ideogram/v1/ideogram-v4/generate" : "https://api.ideogram.ai/v1/ideogram-v4/generate";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": ideogramApiKey
        },
        body: JSON.stringify({
          text_prompt: prompt,
          aspect_ratio: aspectRatio === "3:4" ? "3:4" : aspectRatio === "9:16" ? "9:16" : aspectRatio === "4:5" ? "4:5" : aspectRatio === "16:9" ? "16:9" : "1:1"
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      if (data?.data?.[0]?.url) {
        return data.data[0].url;
      }
      throw new Error("No image URL returned");
    } catch (err) {
      console.warn("Ideogram failed, falling back to Pollinations:", err);
    }
  }

  const { width, height } = getSizes(aspectRatio);
  const baseSeed = Date.now() + index * 9973 + Math.floor(Math.random() * 10000);

  for (let i = 0; i < 3; i++) {
    const seed = baseSeed + i * 50000;
    const url = pollinationsUrl(prompt, seed, width, height);

    try {
      if (i > 0) await new Promise(r => setTimeout(r, 2000 * i));
      return await checkImageUrl(url);
    } catch (err) {
      if (i === 2) throw err;
    }
  }
};

export const createImageJob = (prompt, style, index = 0, aspectRatio = "1:1") => ({
  id: `${Date.now()}-${index}`,
  prompt,
  style: style.id,
  styleLabel: style.label,
  styleIcon: style.icon,
  aspectRatio,
  url: null,
  createdAt: new Date().toISOString(),
  status: "generating",
  error: null
});

export const buildPrompt = (promptText, style) =>
  `${promptText}, ${style.tag}, high quality, detailed`;

export const buildImageUrl = (p, s, w = 512, h = 512) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(p + ", high quality, detailed, masterpiece")}?width=${w}&height=${h}&seed=${s || (Math.random() * 999999 | 0)}&nologo=true&enhance=true`;

export const downloadImage = async (url, filename = "download.jpg") => {
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  } catch {
    window.open(url, "_blank");
  }
};

export const validatePrompt = (prompt) => {
  const trimmed = prompt?.trim() ?? "";
  if (!trimmed) return { valid: false, error: "Please enter a prompt" };
  if (trimmed.length < 3) return { valid: false, error: "Prompt too short" };
  if (trimmed.length > 500) return { valid: false, error: "Prompt too long" };
  return { valid: true };
};
