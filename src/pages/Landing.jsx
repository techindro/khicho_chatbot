import { useState, useEffect, useRef } from "react";
import Logo from "@components/Logo";
import LazyImg from "@components/LazyImg";
import GlowOrb from "@components/GlowOrb";
import { HERO_PROMPTS, FEATURES, STATS } from "@constants";
import { buildImageUrl } from "@utils/imageGen";

/**
 * Landing — Marketing homepage (before auth)
 */
export default function Landing({ onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const btn = {
    primary: {
      padding: "15px 36px",
      background: "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
      border: "none", borderRadius: "14px", color: "white",
      fontSize: "15px", fontWeight: "700", cursor: "pointer",
      fontFamily: "'Playfair Display', serif",
      boxShadow: "0 8px 40px rgba(99,102,241,0.4), 0 0 0 1px rgba(167,139,250,0.15)",
      transition: "all 0.25s",
    },
    ghost: {
      padding: "15px 30px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "14px", color: "rgba(255,255,255,0.7)",
      fontSize: "14px", cursor: "pointer", transition: "all 0.2s",
    },
  };

  return (
    <div style={{ background: "#06060f", color: "white", minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      {/* Background Orbs */}
      <GlowOrb top="-120px" left="-120px" size="550px" color="rgba(99,102,241,0.12)" delay="0s" />
      <GlowOrb top="35%" left="65%" size="450px" color="rgba(167,139,250,0.07)" delay="4s" />
      <GlowOrb top="75%" left="-60px" size="380px" color="rgba(96,165,250,0.06)" delay="7s" />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: "66px", padding: "0 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(6,6,15,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.4s ease",
      }}>
        <Logo size="md" />

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={onLogin}
            style={{
              padding: "9px 24px", background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: "100px",
              color: "rgba(255,255,255,0.7)", cursor: "pointer",
              fontSize: "13px", fontWeight: "500", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
          >
            Sign In
          </button>
          <button
            onClick={onSignup}
            style={{
              padding: "9px 24px",
              background: "linear-gradient(135deg, #6366f1, #a78bfa)",
              border: "none", borderRadius: "100px", color: "white",
              cursor: "pointer", fontSize: "13px", fontWeight: "600",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35)", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Start Free ✦
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "110px 5% 60px", position: "relative", zIndex: 1,
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "100px", padding: "8px 20px", marginBottom: "30px",
          color: "#a78bfa", fontSize: "12px", fontFamily: "monospace",
          animation: "fadeSlideUp 0.6s ease both",
        }}>
          <span style={{
            width: "7px", height: "7px", background: "#6366f1", borderRadius: "50%",
            boxShadow: "0 0 10px #6366f1, 0 0 20px rgba(99,102,241,0.4)",
            display: "inline-block", animation: "pulseGlow 2s infinite",
          }} />
          India's Most Powerful AI Image Generator
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: "clamp(46px, 7.5vw, 92px)", lineHeight: 1.04,
          margin: "0 0 20px", textAlign: "center", letterSpacing: "-1.5px",
          animation: "fadeSlideUp 0.7s ease 0.1s both",
        }}>
          <span style={{ color: "white" }}>Imagine It.</span>
          <br />
          <span style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #f0abfc 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Khicho It.</span>
        </h1>

        {/* Subheading */}
        <p style={{
          color: "rgba(255,255,255,0.45)", textAlign: "center",
          fontSize: "clamp(15px, 2.5vw, 19px)",
          maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.75,
          fontFamily: "'Crimson Pro', serif", fontWeight: 300,
          animation: "fadeSlideUp 0.7s ease 0.2s both",
        }}>
          Turn your words into stunning AI art in seconds.
          Ghibli, Anime, Realistic, Cyberpunk — every style, zero limits.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", gap: "12px", justifyContent: "center",
          flexWrap: "wrap", animation: "fadeSlideUp 0.7s ease 0.3s both",
        }}>
          <button onClick={onSignup} style={btn.primary}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 50px rgba(99,102,241,0.55)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(99,102,241,0.4)"; }}
          >✦ Start Creating — Free</button>
          <button onClick={onLogin} style={btn.ghost}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
          >Sign In →</button>
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "14px", fontFamily: "monospace", animation: "fadeSlideUp 0.7s ease 0.4s both" }}>
          No credit card required • Free forever plan
        </p>

        {/* Hero Image Mosaic */}
        <div style={{
          marginTop: "70px", width: "100%", maxWidth: "1100px",
          display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px",
          animation: "fadeSlideUp 0.8s ease 0.35s both",
        }}>
          {HERO_PROMPTS.map((item, i) => (
            <div key={i} style={{
              gridColumn: i < 2 ? "span 2" : "span 1",
              aspectRatio: i < 2 ? "1.2" : "1",
              borderRadius: "14px", overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
              animation: `fadeSlideUp 0.5s ease ${0.07 * i}s both`,
            }}>
              <LazyImg
                src={buildImageUrl(item.p, item.s, i < 2 ? 600 : 400, i < 2 ? 480 : 400)}
                alt={item.p}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "0 5% 80px" }}>
        <div style={{
          maxWidth: "860px", margin: "0 auto",
          display: "flex",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: "center", padding: "34px 20px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700,
                background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{s.n}</div>
              <div style={{ color: "rgba(255,255,255,0.32)", fontSize: "12px", marginTop: "4px", fontFamily: "monospace" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "0 5% 100px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 700,
            textAlign: "center", marginBottom: "14px",
          }}>
            <span style={{ color: "white" }}>Why creators choose </span>
            <span style={{
              background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Khicho.AI</span>
          </h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", marginBottom: "56px", fontSize: "15px" }}>
            Built for artists, dreamers, and creators across India & beyond
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "22px", padding: "30px 26px",
                transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
                animation: `fadeSlideUp 0.5s ease ${0.08 * i}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)";
                e.currentTarget.style.background = "rgba(99,102,241,0.05)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{ fontSize: "30px", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", margin: "0 0 10px", color: "white" }}>{f.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 5% 100px", position: "relative", zIndex: 1 }}>
        <div style={{
          maxWidth: "820px", margin: "0 auto", textAlign: "center",
          padding: "64px 40px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.09), rgba(167,139,250,0.04))",
          border: "1px solid rgba(99,102,241,0.22)", borderRadius: "32px",
          boxShadow: "0 0 100px rgba(99,102,241,0.07), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, margin: "0 0 14px",
          }}>
            Ready to{" "}
            <span style={{
              background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Khicho</span>?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "30px", fontSize: "15px", lineHeight: 1.7 }}>
            Join 150,000+ creators already making magic with AI
          </p>
          <button onClick={onSignup} style={btn.primary}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >✦ Get Started Free — No Credit Card</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "12px",
        position: "relative", zIndex: 1,
      }}>
        <Logo size="sm" />
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px", fontFamily: "monospace" }}>
          © 2025 Khicho.AI — Made with 💜 in India
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <span key={l} style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", cursor: "pointer", fontFamily: "monospace",
              transition: "color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#a78bfa"}
            onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
            >{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
