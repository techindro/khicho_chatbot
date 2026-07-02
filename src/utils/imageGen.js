import { HfInference } from "@huggingface/inference";

/**
 * Khicho.AI — Image Generation Utilities
 * Primary: Pollinations.AI (free, no token needed)
 * Fallback: HuggingFace FLUX.1-schnell
 */

const HF_MODEL = "black-forest-labs/FLUX.1-schnell";
const HF_IMG2IMG_MODEL = "stabilityai/stable-diffusion-2-1"; // Changed from runwayml/stable-diffusion-v1-5 due to no provider
const HF_API   = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

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

/**
 * Generate image using Pollinations.AI (primary — free, no auth)
 * Falls back to HuggingFace if hfToken is provided and Pollinations fails
 */
export const generateImage = async (prompt, hfToken) => {
  // Primary: Pollinations.AI — free, no auth, works directly as img src
  const seed = Math.floor(Math.random() * 999999);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}&nologo=true&enhance=true&model=flux`;

  // Return the URL directly — img tags load it without CORS issues
  return pollinationsUrl;

  // Fallback: HuggingFace API (needs valid token)
  if (!hfToken) {
    throw new Error("Image generation failed — please try again");
  }

  const res = await fetch(HF_API, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${hfToken}`,
      "Content-Type": "application/json",
      "x-wait-for-model": "true",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { num_inference_steps: 4 }
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error || `Error ${res.status}`;

    if (res.status === 401) throw new Error("Invalid HF token — check your .env file");
    if (res.status === 503) throw new Error("Model is loading — retry in 30 seconds");
    if (res.status === 429) throw new Error("Rate limited — wait a moment and try again");
    throw new Error(msg);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
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
