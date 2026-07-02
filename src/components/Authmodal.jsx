import { useState } from "react";
import Logo from "./logo";

export default function AuthModal({ mode, onClose, onSuccess }) {
  const [tab, setTab] = useState(mode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.email || !form.password) return setError("Please fill all required fields");
    if (tab === "signup" && !form.name) return setError("Please enter your name");
    setError(""); setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onSuccess?.({ name: form.name || form.email.split("@")[0], email: form.email });
  };

  const social = async (p) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onSuccess?.({ name: p === "google" ? "Google User" : "GitHub User", email: `user@${p}.com` });
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    background: "var(--bg-secondary)", border: "1px solid var(--border)",
    borderRadius: "10px", color: "var(--text-primary)", fontSize: "14px",
    transition: "all 0.15s",
  };
  const onFocus = (e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-bg)"; e.target.style.background = "var(--surface)"; };
  const onBlur = (e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; e.target.style.background = "var(--bg-secondary)"; };

  return (
    <div
      role="dialog"
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
        animation: "fadeIn 0.15s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div style={{
        width: "min(420px, 95vw)", background: "var(--surface)",
        border: "1px solid var(--border)", borderRadius: "20px",
        padding: "36px 32px", position: "relative",
        boxShadow: "var(--shadow-xl)",
        animation: "slideUp 0.25s ease",
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "14px", right: "14px",
          background: "var(--bg-tertiary)", border: "none", color: "var(--text-muted)",
          width: "30px", height: "30px", borderRadius: "8px",
          cursor: "pointer", fontSize: "14px", transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--border)"; e.currentTarget.style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >✕</button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Logo size="md" />
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "10px" }}>
            {tab === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "var(--bg-tertiary)", borderRadius: "10px",
          padding: "3px", marginBottom: "20px",
        }}>
          {[["login", "Sign In"], ["signup", "Sign Up"]].map(([t, l]) => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{
              flex: 1, padding: "8px", border: "none", borderRadius: "8px",
              cursor: "pointer", fontWeight: 600, fontSize: "14px",
              transition: "all 0.15s",
              background: tab === t ? "var(--surface)" : "transparent",
              boxShadow: tab === t ? "var(--shadow-sm)" : "none",
              color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
            }}>{l}</button>
          ))}
        </div>

        {/* Social Buttons */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button onClick={() => social("google")} disabled={loading} style={{
            flex: 1, padding: "10px", background: "var(--surface)",
            border: "1px solid var(--border)", borderRadius: "10px",
            color: "var(--text-primary)", cursor: "pointer", fontSize: "13px", fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-secondary)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface)"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button onClick={() => social("github")} disabled={loading} style={{
            flex: 1, padding: "10px", background: "var(--surface)",
            border: "1px solid var(--border)", borderRadius: "10px",
            color: "var(--text-primary)", cursor: "pointer", fontSize: "13px", fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "8px", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-secondary)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--surface)"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#24292f">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {tab === "signup" && (
            <input placeholder="Full Name" value={form.name} onChange={set("name")}
              style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          )}
          <input placeholder="Email address" type="email" value={form.email}
            onChange={set("email")} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          <input placeholder="Password" type="password" value={form.password}
            onChange={set("password")} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>

        {error && <p style={{ color: "var(--error)", fontSize: "13px", marginTop: "8px", textAlign: "center" }}>⚠ {error}</p>}

        {tab === "login" && (
          <div style={{ textAlign: "right", marginTop: "6px" }}>
            <span style={{ color: "var(--accent)", fontSize: "13px", cursor: "pointer" }}>Forgot password?</span>
          </div>
        )}

        <button onClick={submit} disabled={loading} style={{
          width: "100%", marginTop: "16px", padding: "12px",
          background: loading ? "var(--border-hover)" : "var(--button-bg)",
          border: "none", borderRadius: "10px",
          color: "var(--button-text)", fontSize: "15px", fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--button-hover)"; }}
        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "var(--button-bg)"; }}
        >
          {loading ? "Authenticating..." : tab === "login" ? "Sign In" : "Create Account"}
        </button>

        <p style={{ textAlign: "center", marginTop: "12px", color: "var(--text-muted)", fontSize: "12px" }}>
          By continuing you agree to our{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer" }}>Terms</span> &{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer" }}>Privacy</span>
        </p>
      </div>
    </div>
  );
}
