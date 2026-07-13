import { HfInference } from "@huggingface/inference";

/**
 * Khicho.AI — Image Generation Utilities
 * Text-to-image: Pollinations.AI (free, no token needed)
 * Image-to-image: HuggingFace stable-diffusion-2-1
 */

const HF_IMG2IMG_MODEL = "stabilityai/stable-diffusion-2-1";

/**
 * Generate Image-to-Image using HuggingFace Inference SDK
 */
export const generateImageToImage = async (imageBlob, prompt, hfToken) => {
  if (!hfToken) {
    throw new Error("Image-to-Image requires a valid HuggingFace Token");
  }
  
  const hf = new HfInference(hfToken);
  
  try {
    const resultBlob = await hf.imageToImage({
      model: HF_IMG2IMG_MODEL,
      inputs: imageBlob,
      parameters: {
        prompt: prompt,
        strength: 0.75, // Controls how much to change the original image (0.0 to 1.0)
      }
    });
    return URL.createObjectURL(resultBlob);
  } catch (error) {
    throw new Error(error.message || "Failed to transform image");
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
