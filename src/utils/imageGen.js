/**
 * Khicho.AI — Image Generation Utilities
 * Uses Pollinations.AI as the free backend (no API key required)
 * Swap `buildUrl` with your own API (Stability AI, DALL-E, etc.) when scaling
 */

const BASE = "https://image.pollinations.ai/prompt";

/**
 * Build a Pollinations.AI image URL
 * @param {string} prompt  - User prompt + style tag combined
 * @param {number} seed    - Random seed for reproducibility
 * @param {number} width   - Image width in pixels
 * @param {number} height  - Image height in pixels
 * @returns {string} Full image URL
 */
export const buildImageUrl = (prompt, seed, width = 512, height = 512) => {
  const fullPrompt = `${prompt}, high quality, detailed, masterpiece`;
  const encoded = encodeURIComponent(fullPrompt);
  const randomSeed = seed ?? (Math.random() * 999999 | 0);
  return `${BASE}/${encoded}?width=${width}&height=${height}&seed=${randomSeed}&nologo=true&enhance=true`;
};

/**
 * Create an image generation job object
 * @param {string} promptText - Raw user prompt
 * @param {object} style      - Style object from STYLES constant
 * @param {number} index      - Index offset for seed variation
 * @returns {object} Image job with url, metadata
 */
export const createImageJob = (promptText, style, index = 0) => ({
  id: `${Date.now()}-${index}`,
  prompt: promptText,
  style: style.id,
  styleLabel: style.label,
  styleIcon: style.icon,
  url: buildImageUrl(
    `${promptText}, ${style.tag}`,
    Math.random() * 999999 | 0,
    512,
    512
  ),
  createdAt: new Date().toISOString(),
  status: "generating",
});

/**
 * Download an image by URL
 * @param {string} url      - Image URL
 * @param {string} filename - Desired filename
 */
export const downloadImage = async (url, filename = "khicho-ai.jpg") => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    // Fallback: open in new tab
    window.open(url, "_blank");
  }
};

/**
 * Validate a user prompt
 * @param {string} prompt
 * @returns {{ valid: boolean, error?: string }}
 */
export const validatePrompt = (prompt) => {
  const trimmed = prompt?.trim() ?? "";
  if (!trimmed) return { valid: false, error: "Please enter a prompt" };
  if (trimmed.length < 3) return { valid: false, error: "Prompt too short — describe in more detail" };
  if (trimmed.length > 500) return { valid: false, error: "Prompt too long — keep it under 500 characters" };
  return { valid: true };
};
