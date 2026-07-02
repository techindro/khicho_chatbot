/**
 * KhichoLogo — Clean brand logo for light theme
 */
export default function KhichoLogo({ size = "md", showMark = true, className }) {
  const sizes = {
    sm: { mark: 26, text: "16px" },
    md: { mark: 32, text: "20px" },
    lg: { mark: 44, text: "28px" },
    xl: { mark: 60, text: "38px" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        userSelect: "none",
      }}
    >
      {showMark && (
        <div style={{
          width: s.mark, height: s.mark, borderRadius: "8px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width={s.mark * 0.6} height={s.mark * 0.6} viewBox="0 0 24 24" fill="none">
            <path d="M4 4h4v16H4V4zm4 8l8-8h4L12 12l8 8h-4L8 12z" fill="white" />
          </svg>
        </div>
      )}
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        fontSize: s.text,
        color: "#111827",
        lineHeight: 1,
        letterSpacing: "-0.5px",
      }}>
        Khicho<span style={{ color: "#6366f1" }}>.</span><span style={{ color: "#6366f1" }}>AI</span>
      </span>
    </div>
  );
}
