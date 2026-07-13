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

const buildPollinationsUrl = (prompt, seed) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}&nologo=true&enhance=true&model=flux&nocache=${Date.now()}`;

/**
 * Verify image exists via fetch, return the persistent Pollinations URL
 */
const verifyAndGetUrl = async (url, timeoutMs = 120000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Failed to generate image (${response.status})`);
    }
    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) {
      throw new Error("Invalid image response from server");
    }
    return url;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Image generation timed out — try again");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

/**
 * Generate image using Pollinations.AI (primary — free, no auth)
 * Verifies the image loaded and retries on failure
 */
export const generateImage = async (prompt, index = 0) => {
  const baseSeed = Date.now() + index * 9973 + Math.floor(Math.random() * 10000);
  const maxRetries = 3;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const seed = baseSeed + attempt * 50000;
    const url = buildPollinationsUrl(prompt, seed);

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
export const createImageJob = (promptText, style, index = 0) => ({
  id: `${Date.now()}-${index}`,
  prompt: promptText,
  style: style.id,
  styleLabel: style.label,
  styleIcon: style.icon,
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
