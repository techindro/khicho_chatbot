import { useState, useEffect } from "react";
import Logo from "@components/logo";
import LazyImg from "@components/Lazylmg";
import { HERO_PROMPTS, FEATURES, HIGHLIGHTS } from "../constants";
import { buildImageUrl } from "@utils/imageGen";
import {
  Zap, Palette, ShieldCheck, Download, Infinity, Smartphone,
} from "lucide-react";

// Map lucide icon names to components
const ICON_MAP = { Zap, Palette, ShieldCheck, Download, Infinity, Smartphone };

/**
 * Landing — Clean, honest marketing page
 */
export default function Landing({ onLogin, onSignup, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-primary)", minHeight: "100vh" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "60px", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? (theme === "dark" ? "rgba(3,7,18,0.92)" : "rgba(255,255,255,0.92)") : "var(--bg)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid var(--border)",
        transition: "all 0.3s ease",
      }}>
        <Logo size="md" />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={toggleTheme} style={{
            background: "transparent", border: "none", color: "var(--text-secondary)",
            cursor: "pointer", padding: "6px", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {["Models", "Docs", "Pricing"].map(item => (
            <span key={item} style={{
              padding: "6px 14px", fontSize: "14px", color: "var(--text-secondary)",
              cursor: "pointer", borderRadius: "8px", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >{item}</span>
          ))}
          <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 4px" }} />
          <button onClick={onLogin} style={{
            padding: "7px 16px", background: "transparent", border: "none",
            color: "var(--text-primary)", fontSize: "14px", fontWeight: 500,
            cursor: "pointer", borderRadius: "8px", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-tertiary)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >Sign In</button>
          <button onClick={onSignup} style={{
            padding: "7px 18px",
            background: "var(--button-bg)", border: "none", borderRadius: "8px",
            color: "var(--button-text)", fontSize: "14px", fontWeight: 600,
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--button-hover)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--button-bg)"}
          >Sign Up</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "120px 24px 60px", textAlign: "center",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "#eef2ff", border: "1px solid #c7d2fe",
          borderRadius: "9999px", padding: "6px 16px", marginBottom: "24px",
          fontSize: "13px", color: "#4f46e5", fontWeight: 500,
          animation: "fadeSlideUp 0.5s ease both",
        }}>
          <Zap size={14} />
          Free image generator
        </div>

        <h1 style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 800,
          fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.1,
          color: "var(--text-primary)", margin: "0 0 18px", letterSpacing: "-1.5px",
          animation: "fadeSlideUp 0.5s ease 0.1s both",
        }}>
          Turn words into{" "}
          <span style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>images</span>
        </h1>

        <p style={{
          color: "var(--text-secondary)", fontSize: "clamp(16px, 2.2vw, 20px)",
          maxWidth: "600px", margin: "0 auto 32px", lineHeight: 1.6,
          fontWeight: 400, animation: "fadeSlideUp 0.5s ease 0.2s both",
        }}>
          Describe what you want to see and choose an art style. It's fast, free, and there are no limits.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", gap: "12px", justifyContent: "center",
          flexWrap: "wrap", animation: "fadeSlideUp 0.5s ease 0.3s both",
        }}>
          <button onClick={onSignup} style={{
            padding: "12px 28px", display: "flex", alignItems: "center", gap: "8px",
            background: "var(--button-bg)", border: "none", borderRadius: "10px",
            color: "var(--button-text)", fontSize: "15px", fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--button-hover)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--button-bg)"; e.currentTarget.style.transform = "translateY(0)"; }}
          ><Zap size={16} /> Start Creating</button>
          <button onClick={onLogin} style={{
            padding: "12px 28px",
            background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px",
            color: "var(--text-primary)", fontSize: "15px", fontWeight: 500,
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-muted)"; e.currentTarget.style.background = "var(--bg-secondary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg)"; }}
          >Live Demo →</button>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "16px", animation: "fadeSlideUp 0.5s ease 0.4s both" }}>
          No credit card · No account required · Runs in your browser
        </p>
      </section>

      {/* ── HERO IMAGE MOSAIC ── */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px",
        animation: "fadeSlideUp 0.6s ease 0.35s both",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px",
          borderRadius: "16px", overflow: "hidden",
          border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)",
        }} className="hero-grid">
          {HERO_PROMPTS.slice(0, 8).map((item, i) => (
            <div key={i} style={{
              gridColumn: i < 2 ? "span 2" : "span 1",
              aspectRatio: i < 2 ? "1.3" : "1",
              overflow: "hidden", position: "relative",
            }}>
              <LazyImg
                src={buildImageUrl(item.p, item.s, i < 2 ? 600 : 400, i < 2 ? 460 : 400)}
                alt={item.p}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT HIGHLIGHTS (honest) ── */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{
          maxWidth: "700px", margin: "0 auto",
          display: "flex", borderRadius: "14px",
          border: "1px solid var(--border)", overflow: "hidden",
          background: "var(--bg-secondary)",
        }}>
          {HIGHLIGHTS.map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: "center", padding: "24px 16px",
              borderRight: i < HIGHLIGHTS.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800,
                color: "#6366f1", letterSpacing: "-0.5px",
              }}>{s.n}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px", fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES (with real Lucide icons) ── */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
            textAlign: "center", marginBottom: "8px", letterSpacing: "-0.5px",
          }}>
            Why use <span style={{ color: "var(--accent)" }}>Khicho.AI</span>
          </h2>
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "48px", fontSize: "16px" }}>
            Simple, fast, and completely free.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {FEATURES.map((f, i) => {
              const IconComp = ICON_MAP[f.lucideIcon];
              return (
                <div key={i} style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "14px", padding: "24px 20px",
                  transition: "all 0.2s ease", cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-border)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: "var(--accent-bg)", display: "flex", alignItems: "center",
                    justifyContent: "center", marginBottom: "14px", color: "var(--accent)",
                  }}>
                    {IconComp && <IconComp size={20} />}
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}>{f.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, textAlign: "center", marginBottom: "48px", letterSpacing: "-0.5px" }}>
            How it works
          </h2>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { step: "1", title: "Describe your idea", desc: "Type what you want to see in simple english.", icon: "✍️" },
              { step: "2", title: "Pick an art style", desc: "Choose from our list of styles.", icon: "🎨" },
              { step: "3", title: "Generate & download", desc: "Click Generate. Your image is ready in seconds.", icon: "✨" },
            ].map((item, i) => (
              <div key={i} style={{
                flex: "1 1 220px", textAlign: "center", padding: "24px 16px",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "var(--accent-bg)", border: "2px solid var(--accent-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", margin: "0 auto 14px",
                }}>{item.icon}</div>
                <div style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Step {item.step}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 6px", color: "var(--text-primary)" }}>{item.title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{
          maxWidth: "720px", margin: "0 auto", textAlign: "center",
          padding: "56px 32px", borderRadius: "20px",
          background: "var(--bg-secondary)", border: "1px solid var(--border)",
        }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.5px", color: "var(--text-primary)" }}>
            Try it now
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px", fontSize: "16px" }}>
            No account needed. Just describe what you want and click generate.
          </p>
          <button onClick={onSignup} style={{
            padding: "12px 32px", background: "var(--button-bg)", border: "none",
            borderRadius: "10px", color: "var(--button-text)", fontSize: "15px", fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s", display: "inline-flex",
            alignItems: "center", gap: "8px",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--button-hover)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "var(--button-bg)"}
          ><Zap size={16} /> Start Creating</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "20px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px",
      }}>
        <Logo size="sm" />
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          © 2025 Khicho.AI — Open-source AI image generator
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy", "Terms", "GitHub"].map((l) => (
            <span key={l} style={{ color: "var(--text-muted)", fontSize: "13px", cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
            >{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
