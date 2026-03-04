/**
 * GlowOrb — Ambient background glow effect
 */
export default function GlowOrb({ top, left, right, bottom, size = "400px", color, delay = "0s" }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        pointerEvents: "none",
        zIndex: 0,
        animation: "orbFloat 12s ease-in-out infinite",
        animationDelay: delay,
        willChange: "transform",
      }}
    />
  );
}
