import { useState } from "react";
import { downloadImage } from "@utils/imageGen";
import { STYLES } from "@constants";

/**
 * ImageCard — Individual generated image card with hover overlay
 */
export default function ImageCard({ item, onDelete }) {
  const [loaded, setLoaded] = useState(false);
  const [hov, setHov] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const style = STYLES.find((s) => s.id === item.style);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadImage(item.url, `khicho-${item.id}.jpg`);
    setDownloading(false);
  };

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "#0d0d1f",
        transform: hov ? "translateY(-5px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hov
          ? "0 24px 60px rgba(0,0,0,0.55), 0 0 40px rgba(99,102,241,0.18)"
          : "0 4px 20px rgba(0,0,0,0.3)",
        transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
        animation: "fadeSlideUp 0.5s ease forwards",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Image Area */}
      <div style={{ aspectRatio: "1", position: "relative", overflow: "hidden" }}>
        {!loaded && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(110deg, #0d0d1f 30%, #1a1a3e 50%, #0d0d1f 70%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: "32px", height: "32px",
              border: "2.5px solid rgba(99,102,241,0.25)",
              borderTopColor: "#6366f1",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
          </div>
        )}

        <img
          src={item.url}
          alt={item.prompt}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease, transform 0.4s ease",
            transform: hov && loaded ? "scale(1.04)" : "scale(1)",
            display: "block",
          }}
        />

        {/* Hover Overlay */}
        {loaded && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: "14px",
            opacity: hov ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}>
            <p style={{
              color: "rgba(255,255,255,0.8)", fontSize: "11px", margin: "0 0 10px",
              fontFamily: "monospace", lineHeight: 1.4,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {item.prompt}
            </p>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={handleDownload}
                disabled={downloading}
                style={{
                  flex: 1, padding: "8px 10px",
                  background: "rgba(99,102,241,0.85)", backdropFilter: "blur(8px)",
                  border: "none", borderRadius: "9px", color: "white",
                  cursor: "pointer", fontSize: "12px", fontWeight: "600",
                  transition: "background 0.2s",
                }}
              >
                {downloading ? "..." : "⬇ Download"}
              </button>
              <button
                onClick={() => window.open(item.url, "_blank")}
                style={{
                  padding: "8px 12px", background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)", border: "none", borderRadius: "9px",
                  color: "white", cursor: "pointer", fontSize: "13px",
                }}
              >
                ↗
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  style={{
                    padding: "8px 12px", background: "rgba(239,68,68,0.2)",
                    border: "none", borderRadius: "9px",
                    color: "#f87171", cursor: "pointer", fontSize: "13px",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          background: "rgba(99,102,241,0.12)", color: "#a78bfa",
          fontSize: "10px", padding: "4px 10px", borderRadius: "100px",
          fontFamily: "monospace", border: "1px solid rgba(99,102,241,0.2)",
        }}>
          {style?.icon} {style?.label}
        </span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", fontFamily: "monospace" }}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </article>
  );
}
