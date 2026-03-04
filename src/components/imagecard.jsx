import { useState } from "react";
import { downloadImage } from "@utils/imageGen";
import { STYLES } from "@constants";

export default function ImageCard({ item, onDelete }) {
  const [hov, setHov] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const style = STYLES.find((s) => s.id === item.style);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadImage(item.url, `khicho-${item.id}.jpg`);
    setDownloading(false);
  };

  // ── GENERATING STATE ───────────────────────────────────────────────────────
  if (item.status === "generating") {
    return (
      <article style={{
        borderRadius: "16px", overflow: "hidden",
        border: "1px solid rgba(99,102,241,0.2)",
        background: "#0d0d1f",
        animation: "fadeSlideUp 0.4s ease forwards",
      }}>
        <div style={{
          aspectRatio: "1", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "16px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.05), rgba(167,139,250,0.03))",
        }}>
          {/* Spinner */}
          <div style={{
            width: "44px", height: "44px",
            border: "3px solid rgba(99,102,241,0.2)",
            borderTopColor: "#6366f1",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}/>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#a78bfa", fontSize: "12px", fontFamily: "monospace", margin: "0 0 10px" }}>
              Generating with FLUX.1…
            </p>
            {/* Progress bar */}
            <div style={{
              width: "140px", height: "3px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "2px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #6366f1, #a78bfa, #60a5fa)",
                borderRadius: "2px",
                animation: "progressBar 3s ease-in-out infinite",
              }}/>
            </div>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", fontFamily: "monospace", margin: "8px 0 0" }}>
              ~3-8 seconds ⚡
            </p>
          </div>
        </div>
        {/* Footer */}
        <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "rgba(99,102,241,0.12)", color: "#a78bfa",
            fontSize: "10px", padding: "3px 10px", borderRadius: "100px",
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

  // ── ERROR STATE ────────────────────────────────────────────────────────────
  if (item.status === "error") {
    return (
      <article style={{
        borderRadius: "16px", overflow: "hidden",
        border: "1px solid rgba(239,68,68,0.2)",
        background: "#0d0d1f",
        animation: "fadeSlideUp 0.4s ease forwards",
      }}>
        <div style={{
          aspectRatio: "1", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "12px",
          padding: "20px", background: "rgba(239,68,68,0.04)",
        }}>
          <span style={{ fontSize: "32px" }}>⚠️</span>
          <p style={{
            color: "#f87171", fontSize: "11px", fontFamily: "monospace",
            textAlign: "center", margin: 0, lineHeight: 1.6,
          }}>
            {item.error}
          </p>
        </div>
        <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "rgba(239,68,68,0.1)", color: "#f87171",
            fontSize: "10px", padding: "3px 10px", borderRadius: "100px",
            fontFamily: "monospace", border: "1px solid rgba(239,68,68,0.2)",
          }}>
            Failed
          </span>
          {onDelete && (
            <button onClick={() => onDelete(item.id)} style={{
              background: "rgba(239,68,68,0.15)", border: "none",
              color: "#f87171", padding: "4px 12px", borderRadius: "7px",
              cursor: "pointer", fontSize: "11px", fontFamily: "monospace",
            }}>
              Remove
            </button>
          )}
        </div>
      </article>
    );
  }

  // ── DONE STATE — Image ready ───────────────────────────────────────────────
  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: "16px", overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "#0d0d1f",
        transform: hov ? "translateY(-5px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hov
          ? "0 24px 60px rgba(0,0,0,0.55), 0 0 40px rgba(99,102,241,0.18)"
          : "0 4px 20px rgba(0,0,0,0.3)",
        transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
        animation: "fadeSlideUp 0.5s ease forwards",
        cursor: "pointer",
      }}
    >
      <div style={{ aspectRatio: "1", position: "relative", overflow: "hidden" }}>
        <img
          src={item.url}
          alt={item.prompt}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
            transform: hov ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />

        {/* Hover Overlay */}
        {hov && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: "14px", animation: "fadeIn 0.2s ease",
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
                  background: "rgba(99,102,241,0.85)",
                  border: "none", borderRadius: "9px", color: "white",
                  cursor: "pointer", fontSize: "12px", fontWeight: "600",
                  transition: "background 0.2s",
                }}
              >
                {downloading ? "⏳ Saving..." : "⬇ Download"}
              </button>
              <button
                onClick={() => window.open(item.url, "_blank")}
                style={{
                  padding: "8px 12px", background: "rgba(255,255,255,0.12)",
                  border: "none", borderRadius: "9px",
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
