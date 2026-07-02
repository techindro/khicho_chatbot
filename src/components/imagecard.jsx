import { useState } from "react";
import { downloadImage } from "@utils/imageGen";
import { STYLES } from "../constants";

export default function ImageCard({ item, onDelete }) {
  const [hov, setHov] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const style = STYLES.find((s) => s.id === item.style);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadImage(item.url, `khicho-${item.id}.jpg`);
    setDownloading(false);
  };

  // ── GENERATING STATE ──
  if (item.status === "generating") {
    return (
      <article style={{
        borderRadius: "14px", overflow: "hidden",
        border: "1px solid var(--border)", background: "var(--surface)",
        animation: "fadeSlideUp 0.4s ease forwards",
      }}>
        <div style={{
          aspectRatio: "1", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "14px",
          background: "var(--bg-secondary)",
        }}>
          <div style={{
            width: "36px", height: "36px",
            border: "3px solid var(--border)", borderTopColor: "var(--accent)",
            borderRadius: "50%", animation: "spin 0.8s linear infinite",
          }}/>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "var(--accent)", fontSize: "13px", fontWeight: 500, margin: "0 0 8px" }}>
              Generating...
            </p>
            <div style={{
              width: "120px", height: "3px", background: "var(--border)",
              borderRadius: "2px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                borderRadius: "2px", animation: "progressBar 3s ease-in-out infinite",
              }}/>
            </div>
          </div>
        </div>
        <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "var(--accent-bg)", color: "var(--accent)", fontSize: "11px",
            padding: "3px 10px", borderRadius: "9999px", fontWeight: 500,
          }}>{style?.icon} {style?.label}</span>
          <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </article>
    );
  }

  // ── ERROR STATE ──
  if (item.status === "error") {
    return (
      <article style={{
        borderRadius: "14px", overflow: "hidden",
        border: "1px solid var(--border)", background: "var(--surface)",
        animation: "fadeSlideUp 0.4s ease forwards",
      }}>
        <div style={{
          aspectRatio: "1", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "10px",
          padding: "20px", background: "rgba(239, 68, 68, 0.05)",
        }}>
          <span style={{ fontSize: "28px" }}>⚠️</span>
          <p style={{ color: "var(--error)", fontSize: "13px", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
            {item.error}
          </p>
        </div>
        <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)" }}>
          <span style={{
            background: "rgba(239, 68, 68, 0.1)", color: "var(--error)", fontSize: "11px",
            padding: "3px 10px", borderRadius: "9999px", fontWeight: 500,
          }}>Failed</span>
          {onDelete && (
            <button onClick={() => onDelete(item.id)} style={{
              background: "rgba(239, 68, 68, 0.1)", border: "1px solid transparent",
              color: "var(--error)", padding: "4px 12px", borderRadius: "6px",
              cursor: "pointer", fontSize: "12px",
            }}>Remove</button>
          )}
        </div>
      </article>
    );
  }

  // ── DONE STATE ──
  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: "14px", overflow: "hidden",
        border: "1px solid var(--border)", background: "var(--surface)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "var(--shadow-md)" : "var(--shadow-sm)",
        transition: "all 0.2s ease",
        animation: "fadeSlideUp 0.4s ease forwards",
      }}
    >
      <div style={{ aspectRatio: "1", position: "relative", overflow: "hidden" }}>
        <img
          src={item.url}
          alt={item.prompt}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
            transform: hov ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.3s ease",
          }}
        />
        {hov && (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: "14px", animation: "fadeIn 0.15s ease",
          }}>
            <p style={{
              color: "rgba(255,255,255,0.9)", fontSize: "12px", margin: "0 0 10px",
              lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>{item.prompt}</p>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={handleDownload} disabled={downloading} style={{
                flex: 1, padding: "8px", background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px", color: "white", cursor: "pointer",
                fontSize: "12px", fontWeight: 600, transition: "background 0.15s",
              }}>
                {downloading ? "Saving..." : "⬇ Download"}
              </button>
              <button onClick={() => window.open(item.url, "_blank")} style={{
                padding: "8px 12px", background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px",
                color: "white", cursor: "pointer", fontSize: "12px",
              }}>↗</button>
              {onDelete && (
                <button onClick={() => onDelete(item.id)} style={{
                  padding: "8px 12px", background: "rgba(239,68,68,0.3)",
                  border: "none", borderRadius: "8px",
                  color: "white", cursor: "pointer", fontSize: "12px",
                }}>✕</button>
              )}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f3f4f6" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          background: "#eef2ff", color: "#6366f1", fontSize: "11px",
          padding: "3px 10px", borderRadius: "9999px", fontWeight: 500,
        }}>{style?.icon} {style?.label}</span>
        <span style={{ color: "#d1d5db", fontSize: "11px" }}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </article>
  );
}
