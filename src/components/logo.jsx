/**
 * KhichoLogo — Brand logo component with SVG mark + wordmark
 */
export default function KhichoLogo({ size = "md", showMark = true, className }) {
  const sizes = {
    sm: { mark: 28, text: "18px" },
    md: { mark: 36, text: "22px" },
    lg: { mark: 52, text: "32px" },
    xl: { mark: 72, text: "44px" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.mark * 0.25 + "px",
        userSelect: "none",
      }}
    >
      {showMark && (
        <svg width={s.mark} height={s.mark} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="lg2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          {/* Hexagon background */}
          <path d="M100 14 L172 57 L172 143 L100 186 L28 143 L28 57 Z" fill="#0d0d1f" stroke="url(#lg1)" strokeWidth="2.5"/>
          {/* Aperture blades */}
          <path d="M68 55 L100 100 L55 88 Z" fill="url(#lg1)" opacity="0.9"/>
          <path d="M132 55 L100 100 L145 88 Z" fill="url(#lg1)" opacity="0.9"/>
          <path d="M152 100 L100 100 L140 125 Z" fill="url(#lg2)" opacity="0.9"/>
          <path d="M132 145 L100 100 L145 112 Z" fill="url(#lg1)" opacity="0.8"/>
          <path d="M68 145 L100 100 L55 112 Z" fill="url(#lg1)" opacity="0.8"/>
          <path d="M48 100 L100 100 L60 125 Z" fill="url(#lg2)" opacity="0.9"/>
          {/* Center */}
          <circle cx="100" cy="100" r="18" fill="#06060f"/>
          <circle cx="100" cy="100" r="10" fill="url(#lg1)"/>
          <circle cx="100" cy="100" r="5" fill="white" opacity="0.9"/>
          {/* K letterform */}
          <rect x="72" y="62" width="9" height="76" rx="4.5" fill="url(#lg1)"/>
          <path d="M81 100 L116 65 L126 75 L94 105 Z" fill="url(#lg1)"/>
          <path d="M81 100 L116 135 L126 125 L94 95 Z" fill="url(#lg1)"/>
          {/* Sparkle */}
          <path d="M148 38 L151 48 L161 51 L151 54 L148 64 L145 54 L135 51 L145 48 Z" fill="url(#lg2)" opacity="0.9"/>
          <circle cx="156" cy="78" r="3" fill="#ec4899" opacity="0.85"/>
        </svg>
      )}
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700,
        fontSize: s.text,
        background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 60%, #60a5fa 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        lineHeight: 1,
        letterSpacing: "-0.3px",
      }}>
        Khicho<span style={{ WebkitTextFillColor: "#a78bfa", color: "#a78bfa" }}>.</span>
        <span style={{ WebkitTextFillColor: "white", color: "white" }}>AI</span>
      </span>
    </div>
  );
}
