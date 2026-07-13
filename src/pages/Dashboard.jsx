import { useState, useEffect, useRef, useCallback } from "react";
import Logo from "@components/logo";
import ImageCard from "@components/imagecard";
import { STYLES, SUGGESTIONS } from "../constants";
import { createImageJob, validatePrompt, generateImage, generateImageToImage, buildPrompt } from "@utils/imageGen";
import {
  Home, Compass, Sparkles, Archive, ImagePlus, X, LogOut, Sun, Moon, Settings2,
} from "lucide-react";

export default function Dashboard({ user, hfToken, onLogout, theme, toggleTheme }) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [count, setCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const [images, setImages] = useState(() => {
    try {
      const saved = localStorage.getItem("khicho_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const successfulImages = images.filter((img) => img.status === "done");
      localStorage.setItem("khicho_history", JSON.stringify(successfulImages.slice(0, 50)));
    } catch (err) {
      console.error("Failed to save history:", err);
    }
  }, [images]);

  const generate = useCallback(async () => {
    const { valid, error: validError } = validatePrompt(prompt);
    if (!valid && !uploadedImage) return setError(validError);
    if (loading) return;

    setError("");
    setLoading(true);
    const selectedStyle = STYLES.find((s) => s.id === style);
    const fullPrompt = buildPrompt(prompt.trim() || "stylize this image", selectedStyle);

    const placeholders = Array.from({ length: count }, (_, i) =>
      createImageJob(prompt.trim(), selectedStyle, i)
    );
    setImages((prev) => [...placeholders, ...prev]);

    // Generate one at a time to avoid Pollinations rate limits
    for (let i = 0; i < placeholders.length; i++) {
      const ph = placeholders[i];
      if (i > 0) await new Promise((r) => setTimeout(r, 1500));

      try {
        let url;
        if (uploadedImage) {
          url = await generateImageToImage(uploadedImage, fullPrompt, hfToken);
        } else {
          url = await generateImage(fullPrompt, i);
        }
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
    }
    setLoading(false);
  }, [prompt, style, count, loading, hfToken, uploadedImage]);

  const deleteImage = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return setError("Image must be under 5MB");
      setUploadedImage(file);
      setError("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  };

  return (
    <div className="mj-app">
      {/* Sidebar */}
      <aside className="mj-sidebar">
        <Logo size="sm" showMark />
        <div style={{ width: 32, height: 1, background: "var(--border)", margin: "8px 0" }} />
        <button className="mj-sidebar-btn active" title="Create"><Sparkles size={20} /></button>
        <button className="mj-sidebar-btn" title="Explore"><Compass size={20} /></button>
        <button className="mj-sidebar-btn" title="Home"><Home size={20} /></button>
        <button className="mj-sidebar-btn" title="Archive"><Archive size={20} /></button>
        <div className="mj-sidebar-spacer" />
        <button className="mj-sidebar-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="mj-sidebar-btn" onClick={onLogout} title="Log out">
          <LogOut size={18} />
        </button>
      </aside>

      {/* Main */}
      <main className="mj-main">
        <header className="mj-topbar">
          <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
            {images.length > 0 ? `${images.length} creations` : "Create"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="mj-user-pill">
              <div className="mj-avatar">{user.name?.charAt(0).toUpperCase() || "U"}</div>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{user.name}</span>
            </div>
          </div>
        </header>

        <div className="mj-gallery">
          {images.length === 0 ? (
            <div className="mj-gallery-empty">
              <Sparkles size={32} strokeWidth={1} color="var(--text-muted)" />
              <h2>What will you imagine?</h2>
              <p>Type a prompt below and press Enter to generate stunning AI art in seconds.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
                {SUGGESTIONS.slice(0, 3).map((s, i) => (
                  <button key={i} className="mj-prompt-btn" onClick={() => setPrompt(s)}>{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mj-gallery-grid">
              {images.map((img) => (
                <ImageCard key={img.id} item={img} onDelete={deleteImage} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom prompt bar */}
      <div className="mj-prompt-dock">
        <div className="mj-prompt-bar">
          {uploadedImage && (
            <div style={{ position: "relative", display: "inline-block", marginBottom: 10 }}>
              <img
                src={URL.createObjectURL(uploadedImage)}
                alt="Reference"
                style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }}
              />
              <button
                onClick={() => setUploadedImage(null)}
                style={{
                  position: "absolute", top: -6, right: -6,
                  width: 18, height: 18, borderRadius: "50%",
                  background: "var(--surface)", border: "1px solid var(--border)",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)",
                }}
              ><X size={10} /></button>
            </div>
          )}

          <textarea
            className="mj-prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Imagine..."
            rows={1}
          />

          {error && (
            <p style={{ color: "var(--error)", fontSize: 12, marginTop: 6 }}>{error}</p>
          )}

          <div className="mj-prompt-toolbar">
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: "none" }} />
            <button className="mj-prompt-btn" onClick={() => fileInputRef.current?.click()}>
              <ImagePlus size={14} /> Image
            </button>
            <button
              className={`mj-prompt-btn ${showSettings ? "active" : ""}`}
              onClick={() => setShowSettings((s) => !s)}
            >
              <Settings2 size={14} /> Settings
            </button>

            {showSettings && (
              <div className="mj-style-scroll hide-scrollbar">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    className={`mj-prompt-btn ${style === s.id ? "active" : ""}`}
                    onClick={() => setStyle(s.id)}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            )}

            <div className="mj-count-toggle">
              {[1, 2, 4].map((n) => (
                <button key={n} className={count === n ? "active" : ""} onClick={() => setCount(n)}>
                  {n}
                </button>
              ))}
            </div>

            <button className="mj-generate-btn" onClick={generate} disabled={loading}>
              {loading ? (
                <>
                  <div style={{
                    width: 14, height: 14,
                    border: "2px solid rgba(0,0,0,0.2)", borderTopColor: "var(--button-text)",
                    borderRadius: "50%", animation: "spin 0.8s linear infinite",
                  }} />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles size={14} /> Imagine
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
