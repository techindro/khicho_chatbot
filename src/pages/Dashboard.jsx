// Dashboard.jsx mein sirf generate function badlo
// Baaki sab same rahega

// ── STEP 1: Import mein generateImage aur buildPrompt add karo ──────────────

// PURANA:
import { createImageJob, validatePrompt, downloadImage } from "@utils/imageGen";

// NAYA:
import { createImageJob, validatePrompt, downloadImage, generateImage, buildPrompt } from "@utils/imageGen";


// ── STEP 2: Props mein hfToken add karo ─────────────────────────────────────

// PURANA:
export default function Dashboard({ user, onLogout }) {

// NAYA:
export default function Dashboard({ user, hfToken, onLogout }) {


// ── STEP 3: generate function ko poora replace karo ─────────────────────────

// PURANA generate function hatao aur yeh lagao:

  const generate = useCallback(async () => {
    const { valid, error: validError } = validatePrompt(prompt);
    if (!valid) return setError(validError);
    if (loading) return;

    setError("");
    setLoading(true);
    const selectedStyle = STYLES.find((s) => s.id === style);
    const fullPrompt = buildPrompt(prompt.trim(), selectedStyle);

    // Pehle placeholder cards dikhao
    const placeholders = Array.from({ length: count }, (_, i) =>
      createImageJob(prompt.trim(), selectedStyle, i)
    );
    setImages((prev) => [...placeholders, ...prev]);
    setLoading(false);

    setTimeout(() => {
      galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    // Sab images parallel mein generate karo
    placeholders.forEach(async (ph) => {
      try {
        const url = await generateImage(fullPrompt, hfToken);
        setImages((prev) =>
          prev.map((img) =>
            img.id === ph.id ? { ...img, url, status: "done" } : img
          )
        );
      } catch (err) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === ph.id ? { ...img, status: "error", error: err.message } : img
          )
        );
      }
    });
  }, [prompt, style, count, loading, hfToken]);
