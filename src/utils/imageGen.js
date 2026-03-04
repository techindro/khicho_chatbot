/**
 * Khicho.AI — Image Generation Utilities
 * Uses Hugging Face FLUX.1-schnell — fast (3-8 sec), free token
 */

const HF_MODEL = "black-forest-labs/FLUX.1-schnell";
const HF_API   = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

/**
 * Generate image using Hugging Face API
 * Returns a blob URL (not a direct link)
 */
export const generateImage = async (prompt, hfToken) => {
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

    if (res.status === 401) throw new Error("Invalid HF token — App.jsx mein token check karo");
    if (res.status === 503) throw new Error("Model load ho raha hai — 30 sec baad retry karo");
    if (res.status === 429) throw new Error("Rate limit — thoda ruko phir try karo");
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
