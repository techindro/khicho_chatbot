import { useState, useEffect, useRef, useCallback } from "react";
import Logo from "@components/logo";
import ImageCard from "@components/imagecard";
import { STYLES, SUGGESTIONS } from "../constants";
import { createImageJob, validatePrompt, generateImage, generateImageToImage, buildPrompt } from "@utils/imageGen";
import { ImagePlus, X } from "lucide-react";

export default function Dashboard({ user, hfToken, onLogout, theme, toggleTheme }) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("ghibli");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Load history from localStorage
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

  // Save successful images to localStorage
  useEffect(() => {
    try {
      const successfulImages = images.filter(img => img.status === "done");
      localStorage.setItem("khicho_history", JSON.stringify(successfulImages.slice(0, 50))); // Keep last 50
    } catch (err) {
      console.error("Failed to save history:", err);
    }
  }, [images]);

  const galleryRef = useRef(null);

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
    setLoading(false);

    setTimeout(() => {
      galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    placeholders.forEach(async (ph) => {
      try {
        let url;
        if (uploadedImage) {
          url = await generateImageToImage(uploadedImage, fullPrompt, hfToken);
        } else {
          url = await generateImage(fullPrompt, hfToken);
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
    });
  }, [prompt, style, count, loading, hfToken, uploadedImage]);

  const deleteImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setUploadedImage(file);
      setError("");
    }
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-primary)", minHeight: "100vh" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        height: "60px", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: theme === "dark" ? "rgba(3,7,18,0.92)" : "rgba(255,255,255,0.92)", 
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <Logo size="sm" />
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={toggleTheme} style={{
            background: "transparent", border: "none", color: "var(--text-secondary)",
            cursor: "pointer", padding: "6px", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "4px 12px 4px 4px", borderRadius: "9999px",
            border: "1px solid var(--border)", background: "var(--bg-secondary)",
          }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 700, color: "white",
            }}>{user.name?.charAt(0).toUpperCase() || "U"}</div>
            <span style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }}>
              {user.name}
            </span>
          </div>
          <button onClick={onLogout} style={{
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--text-secondary)", padding: "6px 14px", borderRadius: "8px",
            fontSize: "13px", cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--error)"; e.currentTarget.style.color = "var(--error)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
            Log out
          </button>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px 100px" }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.5px", color: "var(--text-primary)" }}>
            Create Images
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", margin: 0 }}>
            Describe what you want to see, pick a style, and generate.
          </p>
        </div>

        {/* ── GENERATOR CARD ── */}
        <div style={{
          border: "1px solid var(--border)", borderRadius: "16px",
          background: "var(--surface)", padding: "24px",
          boxShadow: "var(--shadow-sm)",
        }}>
          {/* Prompt & Image Upload */}
          <div style={{
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "14px 16px",
            transition: "all 0.15s",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-bg)"; e.currentTarget.style.background = "var(--surface)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "var(--bg-secondary)"; }}
          >
            {uploadedImage && (
              <div style={{ position: "relative", display: "inline-block", marginBottom: "12px" }}>
                <img 
                  src={URL.createObjectURL(uploadedImage)} 
                  alt="Upload preview" 
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border)" }} 
                />
                <button 
                  onClick={() => setUploadedImage(null)}
                  style={{
                    position: "absolute", top: "-6px", right: "-6px",
                    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "50%",
                    width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "var(--text-secondary)", boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            )}
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cyberpunk city with neon reflections in puddles, highly detailed..."
              rows={3}
              style={{
                width: "100%", padding: "0", background: "transparent",
                border: "none", outline: "none", color: "var(--text-primary)", fontSize: "15px",
                resize: "none", lineHeight: 1.5,
              }}
            />
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                style={{ display: "none" }} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: "transparent", border: "none", color: "var(--text-secondary)",
                  display: "flex", alignItems: "center", gap: "6px", fontSize: "13px",
                  cursor: "pointer", padding: "4px 8px", borderRadius: "6px",
                  transition: "all 0.15s"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-bg)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
              >
                <ImagePlus size={16} /> Add Image to stylize
              </button>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{prompt.length}/500</span>
            </div>
          </div>

          {error && <p style={{ color: "var(--error)", fontSize: "13px", marginTop: "8px" }}>⚠ {error}</p>}

          {/* Style Selector */}
          <div style={{ marginTop: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Art Style
            </label>
            <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }} className="hide-scrollbar">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  style={{
                    padding: "7px 14px", borderRadius: "9999px",
                    border: "1px solid",
                    background: style === s.id ? "var(--accent-bg)" : "var(--surface)",
                    borderColor: style === s.id ? "var(--accent)" : "var(--border)",
                    color: style === s.id ? "var(--accent)" : "var(--text-secondary)",
                    fontWeight: style === s.id ? 600 : 400,
                    cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: "5px", fontSize: "13px",
                  }}
                  onMouseEnter={(e) => { if (style !== s.id) e.currentTarget.style.borderColor = "var(--text-muted)"; }}
                  onMouseLeave={(e) => { if (style !== s.id) e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom row: count + generate */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "16px", flexWrap: "wrap" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Images
              </label>
              <div style={{ display: "flex", background: "var(--bg-tertiary)", borderRadius: "8px", padding: "3px", border: "1px solid var(--border)" }}>
                {[1, 2, 4].map(n => (
                  <button key={n} onClick={() => setCount(n)} style={{
                    padding: "5px 14px", borderRadius: "6px", border: "none",
                    background: count === n ? "var(--surface)" : "transparent",
                    boxShadow: count === n ? "var(--shadow-sm)" : "none",
                    color: count === n ? "var(--text-primary)" : "var(--text-muted)",
                    fontWeight: count === n ? 600 : 400,
                    cursor: "pointer", transition: "all 0.15s", fontSize: "14px",
                  }}>{n}</button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              disabled={loading}
              style={{
                marginLeft: "auto",
                padding: "10px 28px", borderRadius: "10px", border: "none",
                background: loading ? "var(--border-hover)" : "var(--button-bg)",
                color: "var(--button-text)", fontSize: "14px", fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: "6px",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--button-hover)"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--button-bg)"; }}
            >
              {loading ? (
                <>
                  <div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Generating...
                </>
              ) : "Generate →"}
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ marginTop: "14px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Try:</span>
          {SUGGESTIONS.slice(0, 4).map((s, i) => (
            <button key={i} onClick={() => setPrompt(s)} style={{
              background: "transparent", border: "1px solid var(--border)",
              borderRadius: "9999px", padding: "4px 12px", color: "var(--text-secondary)",
              fontSize: "12px", cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-border)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >{s}</button>
          ))}
        </div>

        {/* ── GALLERY ── */}
        <div ref={galleryRef} style={{ marginTop: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Your Creations</h2>
            <span style={{
              background: "var(--accent-bg)", color: "var(--accent)", padding: "2px 8px",
              borderRadius: "9999px", fontSize: "12px", fontWeight: 600,
            }}>{images.length}</span>
          </div>

          {images.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              background: "var(--bg-secondary)", borderRadius: "16px",
              border: "1px dashed var(--border-hover)",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.4 }}>🎨</div>
              <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
                Your gallery is empty.<br />Generate something amazing above.
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px",
            }}>
              {images.map((img) => (
                <ImageCard key={img.id} item={img} onDelete={deleteImage} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
