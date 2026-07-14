/**
 * Khicho.AI — Image Generation Utilities
 * Text-to-image: Pollinations.AI (free, no token needed)
 * Image-to-image: Pollinations.AI with reference image (free, no token needed)
 */

/**
 * Upload image to a temporary hosting service and get a public URL.
 * Uses Pollinations' ability to accept reference images via the `image` query param.
 */
const blobToDataUrl = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Generate Image-to-Image using Pollinations.AI with reference image
 * Uses the kontext model which supports image editing via URL reference
 */
export const generateImageToImage = async (imageBlob, prompt, _hfToken, aspectRatio = "1:1") => {
  try {
    // Convert blob to data URL for upload
    const dataUrl = await blobToDataUrl(imageBlob);

    // Call the express backend proxy endpoint for RunwayML
    const ratioStr = aspectRatio === "16:9" ? "1280:720" : 
                     aspectRatio === "9:16" ? "720:1280" : 
                     aspectRatio === "3:4" ? "768:1024" : 
                     aspectRatio === "4:5" ? "1024:1280" : "1024:1024";

    const response = await fetch("/api/runway/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        imageBase64: dataUrl,
        ratio: ratioStr,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `Runway generation failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error("RunwayML generation failed:", error);
    throw error;
  }
};

const getDimensionsFromAspectRatio = (ratio) => {
  if (ratio === "16:9") return { width: 768, height: 432 };
  if (ratio === "9:16") return { width: 432, height: 768 };
  if (ratio === "3:4")  return { width: 480, height: 640 };
  if (ratio === "4:5")  return { width: 512, height: 640 };
  return { width: 512, height: 512 }; // Default 1:1
};

const buildPollinationsUrl = (prompt, seed, width = 512, height = 512) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true&model=flux&nocache=${Date.now()}`;

/**
 * Verify image exists via fetch, return the persistent Pollinations URL
 */
const verifyAndGetUrl = (url, timeoutMs = 120000) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => {
      img.src = "";
      reject(new Error("Image generation timed out — try again"));
    }, timeoutMs);

    img.onload = () => {
      clearTimeout(timer);
      resolve(url);
    };

    img.onerror = () => {
      clearTimeout(timer);
      reject(new Error("Failed to generate image (check connection)"));
    };

    img.src = url;
  });
};

/**
 * Generate image using Ideogram (if subscribed) or Pollinations.AI (free backup)
 */
export const generateImage = async (prompt, index = 0, currentTier = "Free", ideogramApiKey = "", aspectRatio = "1:1") => {
  // If user is on a paid tier and we have an Ideogram key, call Ideogram
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
        const errText = await res.text();
        throw new Error(`Ideogram API failed: ${res.statusText || errText}`);
      }

      const data = await res.json();
      if (data && data.data && data.data[0] && data.data[0].url) {
        return data.data[0].url;
      } else {
        throw new Error("No image data returned from Ideogram");
      }
    } catch (err) {
      console.warn("Ideogram generation failed, falling back to Pollinations:", err);
    }
  }

  // Pollinations.AI Free Tier / Fallback Logic
  const { width, height } = getDimensionsFromAspectRatio(aspectRatio);
  const baseSeed = Date.now() + index * 9973 + Math.floor(Math.random() * 10000);
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const seed = baseSeed + attempt * 50000;
    const url = buildPollinationsUrl(prompt, seed, width, height);

    try {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
      return await verifyAndGetUrl(url);
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
    }
  }
};

/**
 * Create an image job placeholder
 */
export const createImageJob = (promptText, style, index = 0, aspectRatio = "1:1") => ({
  id: `${Date.now()}-${index}`,
  prompt: promptText,
  style: style.id,
  styleLabel: style.label,
  styleIcon: style.icon,
  aspectRatio: aspectRatio,
  url: null,
  createdAt: new Date().toISOString(),
  status: "generating", // "generating" | "done" | "error"
  error: null,
});

/**
 * Build full prompt with style tag
 */
export const buildPrompt = (promptText, style) =>
  `${promptText}, ${style.tag}, high quality, detailed`;

/**
 * Generate a static URL from Pollinations.AI for the hero section
 */
export const buildImageUrl = (p, s, w=512, h=512) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(p+", high quality, detailed, masterpiece")}?width=${w}&height=${h}&seed=${s||Math.random()*999999|0}&nologo=true&enhance=true`;

/**
 * Download image
 */
export const downloadImage = async (url, filename = "khicho-ai.jpg") => {
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  } catch {
    window.open(url, "_blank");
  }
};

/**
 * Validate prompt
 */
export const validatePrompt = (prompt) => {
  const trimmed = prompt?.trim() ?? "";
  if (!trimmed)           return { valid: false, error: "Please enter a prompt" };
  if (trimmed.length < 3) return { valid: false, error: "Prompt too short — describe in more detail" };
  if (trimmed.length > 500) return { valid: false, error: "Prompt too long — keep it under 500 characters" };
  return { valid: true };
};
