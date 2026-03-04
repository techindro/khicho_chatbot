import { useState } from "react";

/**
 * LazyImg — Image with shimmer skeleton loading state
 */
export default function LazyImg({ src, alt, style, className }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }} className={className}>
      {!loaded && !error && (
        <div
          aria-label="Loading image..."
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(110deg, #0d0d1f 30%, #1a1a3e 50%, #0d0d1f 70%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}
      {error && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", background: "#0d0d1f",
          color: "rgba(255,255,255,0.3)", gap: "8px", fontSize: "12px",
        }}>
          <span style={{ fontSize: "24px" }}>⚠</span>
          Failed to load
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s ease",
          display: "block",
        }}
      />
    </div>
  );
}
