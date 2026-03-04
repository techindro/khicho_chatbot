import { useState } from "react";
import Logo from "./Logo";

const inp = {
  width: "100%", padding: "13px 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "12px", color: "white",
  fontSize: "14px", fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s", outline: "none",
};

/**
 * AuthModal — Sign In / Sign Up modal with social providers
 */
export default function AuthModal({ mode = "login", onClose, onSuccess }) {
  const [tab, setTab] = useState(mode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const focus = (e) => { e.target.style.borderColor = "rgba(167,139,250,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; };
  const blur = (e) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; };

  const handleSubmit = async () => {
    if (!form.email || !form.password) return setError("Please fill all required fields");
    if (tab === "signup" && !form.name) return setError("Please enter your name");
    setError(""); setLoading(true);
    await new Promise((r) => setTimeout(r, 1300));
    setLoading(false);
    onSuccess?.({ name: form.name || form.email.split("@")[0], email: form.email });
  };

  const handleSocial = async (provider) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onSuccess?.({ name: provider === "google" ? "Google User" : "GitHub User", email: `user@${provider}.com` });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={tab === "login" ? "Sign in to Khicho.AI" : "Create your Khicho.AI account"}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.82)", backdropFilter: "blur(16px)",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div style={{
        width: "min(448px, 95vw)",
        background: "rgba(10,10,22,0.98)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "28px", padding: "40px 36px",
        position: "relative",
        boxShadow: "0 40px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(99,102,241,0.06)",
        animation: "slideUp 0.3s cubic-bezier(0.23,1,0.32,1)",
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: "18px", right: "18px",
            background: "rgba(255,255,255,0.06)", border: "none",
            color: "rgba(255,255,255,0.5)", width: "32px", height: "32px",
            borderRadius: "8px", cursor: "pointer", fontSize: "16px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
        >✕</button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Logo size="md" />
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginTop: "10px", fontFamily: "monospace" }}>
            {tab === "login" ? "Welcome back, creator ✦" : "Start creating for free ✦"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: "12px",
          padding: "4px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {[["login", "Sign In"], ["signup", "Sign Up"]].map(([t, label]) => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{
              flex: 1, padding: "10px", border: "none", borderRadius: "9px",
              cursor: "pointer", fontWeight: "600", fontSize: "14px", transition: "all 0.2s",
              background: tab === t ? "rgba(99,102,241,0.3)" : "transparent",
              color: tab === t ? "#a78bfa" : "rgba(255,255,255,0.4)",
              boxShadow: tab === t ? "0 2px 12px rgba(99,102,241,0.2)" : "none",
            }}>{label}</button>
          ))}
        </div>

        {/* Social */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {[
            { id: "google", icon: "G", label: "Google", bg: "rgba(234,67,53,0.1)", border: "rgba(234,67,53,0.2)", color: "#f87171" },
            { id: "github", icon: "⊞", label: "GitHub", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" },
          ].map((b) => (
            <button key={b.id} onClick={() => handleSocial(b.id)} disabled={loading} style={{
              flex: 1, padding: "11px", background: b.bg,
              border: `1px solid ${b.border}`, borderRadius: "12px",
              color: b.color, cursor: "pointer", fontSize: "13px", fontWeight: "600",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            >
              <span style={{ fontWeight: "800", fontSize: "15px" }}>{b.icon}</span> {b.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", fontFamily: "monospace" }}>or email</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {tab === "signup" && (
            <input placeholder="Full Name" value={form.name} onChange={set("name")}
              style={inp} onFocus={focus} onBlur={blur} autoComplete="name" />
          )}
          <input placeholder="Email address" type="email" value={form.email} onChange={set("email")}
            style={inp} onFocus={focus} onBlur={blur} autoComplete="email" />
          <input placeholder="Password" type="password" value={form.password} onChange={set("password")}
            style={inp} onFocus={focus} onBlur={blur} autoComplete={tab === "login" ? "current-password" : "new-password"}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        </div>

        {error && (
          <p style={{ color: "#f87171", fontSize: "12px", marginTop: "10px", textAlign: "center", fontFamily: "monospace" }}>
            ⚠ {error}
          </p>
        )}

        {tab === "login" && (
          <div style={{ textAlign: "right", marginTop: "8px" }}>
            <span style={{ color: "#a78bfa", fontSize: "12px", cursor: "pointer", fontFamily: "monospace" }}>
              Forgot password?
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", marginTop: "20px", padding: "15px",
            background: loading
              ? "rgba(99,102,241,0.3)"
              : "linear-gradient(135deg, #6366f1 0%, #a78bfa 60%, #60a5fa 100%)",
            border: "none", borderRadius: "14px", color: "white",
            fontSize: "15px", fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Playfair Display', serif",
            boxShadow: loading ? "none" : "0 8px 30px rgba(99,102,241,0.4), 0 0 0 1px rgba(167,139,250,0.1)",
            transition: "all 0.2s", letterSpacing: "0.2px",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          {loading ? "✦ Authenticating..." : tab === "login" ? "✦ Sign In" : "✦ Create Account — Free"}
        </button>

        <p style={{ textAlign: "center", marginTop: "16px", color: "rgba(255,255,255,0.25)", fontSize: "11px", fontFamily: "monospace" }}>
          By continuing you agree to our{" "}
          <span style={{ color: "#a78bfa", cursor: "pointer" }}>Terms</span> &{" "}
          <span style={{ color: "#a78bfa", cursor: "pointer" }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
