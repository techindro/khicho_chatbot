import { useState, useEffect } from "react";
import Logo from "@components/logo";
import LazyImg from "@components/Lazylmg";
import { HERO_PROMPTS, HIGHLIGHTS } from "../constants";
import { buildImageUrl } from "@utils/imageGen";
import { Sun, Moon, Zap, Palette, Shield, Download, Infinity, Smartphone, Heart } from "lucide-react";

export default function Landing({ onLogin, onSignup, theme, toggleTheme, onPricingClick }) {
  const [scrolled, setScrolled] = useState(false);

  const footerLinkStyle = {
    color: "var(--text-secondary)",
    fontSize: "13px",
    cursor: "pointer",
    transition: "color 0.15s ease",
  };

  const footerHover = (e) => {
    e.currentTarget.style.color = "var(--text-primary)";
  };

  const footerLeave = (e) => {
    e.currentTarget.style.color = "var(--text-secondary)";
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="mj-landing">
      {/* Background mosaic */}
      <div className="mj-landing-bg" aria-hidden="true">
        {HERO_PROMPTS.slice(0, 12).map((item, i) => (
          <div key={i}>
            <LazyImg
              src={buildImageUrl(item.p, item.s, 400, 400)}
              alt=""
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ))}
      </div>

      {/* Nav */}
      <nav className="mj-landing-nav" style={{
        background: scrolled ? "var(--nav-bg-scrolled)" : "var(--nav-bg)",
      }}>
        <Logo size="md" />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button className="mj-nav-link" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <span className="mj-nav-link" style={{ cursor: "pointer" }}>Explore</span>
          <span className="mj-nav-link" onClick={onPricingClick} style={{ cursor: "pointer" }}>Pricing</span>
          <button className="mj-nav-link" onClick={onLogin}>Sign In</button>
          <button className="mj-cta-btn" onClick={onSignup} style={{ padding: "10px 24px", fontSize: 14 }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mj-landing-hero">
        <h1 className="animate-slide-up animate-delay-1">
          Explore new<br /><em>ways of creating</em>
        </h1>
        <p className="animate-slide-up animate-delay-2">
          Turn your imagination into stunning visuals. Describe anything — we bring it to life.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }} className="animate-slide-up animate-delay-3">
          <button className="mj-cta-btn" onClick={onSignup}>Start Creating</button>
          <button className="mj-ghost-btn" onClick={onLogin}>Sign In</button>
        </div>
      </section>

      {/* Showcase grid */}
      <section className="mj-landing-showcase animate-slide-up animate-delay-4">
        <div className="mj-showcase-grid">
          {HERO_PROMPTS.slice(0, 8).map((item, i) => (
            <div key={i}>
              <LazyImg
                src={buildImageUrl(item.p, item.s, i < 2 ? 600 : 400, i < 2 ? 600 : 400)}
                alt={item.p}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <div className="mj-feature-row animate-slide-up animate-delay-4">
        {HIGHLIGHTS.map((s, i) => (
          <div key={i} className="mj-feature-item">
            <div className="num">{s.n}</div>
            <div className="label">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Startup / About Mission Section */}
      {/* Features Grid Section (Leonardo.AI / Kling AI style) */}
      <section style={{
        position: "relative",
        zIndex: 1,
        padding: "80px 24px",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#8b5cf6",
              fontWeight: 700,
              background: "rgba(139, 92, 246, 0.08)",
              padding: "4px 12px",
              borderRadius: "9999px",
              display: "inline-block",
              marginBottom: "16px"
            }}>
              Features & Capabilities
            </span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 3.5vw, 36px)",
              fontWeight: 400,
              color: "var(--text-primary)",
              letterSpacing: "-0.5px"
            }}>
              Next-generation AI creative tools
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px"
          }}>
            {/* Feature Cards */}
            <div className="mj-feature-card">
              <Zap size={24} style={{ color: "#3b82f6", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Real-time Generation</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>Images generate in less than 10 seconds with optimized pipeline scheduling.</p>
            </div>

            <div className="mj-feature-card">
              <Palette size={24} style={{ color: "#8b5cf6", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Ideogram v4 Engine</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>Unlock state-of-the-art typographic text rendering and professional aesthetic details.</p>
            </div>

            <div className="mj-feature-card">
              <Shield size={24} style={{ color: "#10b981", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Safe & Private</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>We respect ownership. Your generations, uploads, and prompts stay secure.</p>
            </div>

            <div className="mj-feature-card">
              <Download size={24} style={{ color: "#fb923c", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>High-Res Exports</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>Download your artwork in high-fidelity JPG/PNG formats without any watermarks.</p>
            </div>

            <div className="mj-feature-card">
              <Infinity size={24} style={{ color: "#ef4444", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Unlimited Presets</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>Easily switch between Ghibli, 3D Render, Cyberpunk, Watercolor, and Anime styles.</p>
            </div>

            <div className="mj-feature-card">
              <Smartphone size={24} style={{ color: "#22d3ee", marginBottom: "16px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>Multi-Device Canvas</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>Create AI art on the go. Perfectly optimized for mobile web browsers and tablets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        position: "relative", zIndex: 1, textAlign: "center",
        padding: "80px 24px",
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 4vw, 48px)",
          fontWeight: 400,
          marginBottom: 16,
          letterSpacing: -1,
        }}>
          Ready to create?
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: 16 }}>
          Free, unlimited, no credit card required.
        </p>
        <button className="mj-cta-btn" onClick={onSignup}>Get Started Free</button>
      </section>

      {/* Footer */}
      <footer className="mj-landing-footer" style={{
        display: "block",
        borderTop: "1px solid var(--border)",
        background: "var(--bg)",
        padding: "80px 4% 40px",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "48px",
          marginBottom: "60px",
        }}>
          {/* Logo & Tagline Column */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "16px", minWidth: "250px" }}>
            <Logo size="md" />
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, maxWidth: "320px" }}>
              India's premier AI art engine. Turn text prompts into Ghibli, Anime, and hyper-realistic art in seconds.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              {["Discord", "Twitter", "Instagram", "GitHub"].map((s) => (
                <span key={s} style={{ color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Column 1: Product */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
            <h4 style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Product</h4>
            <span onClick={onPricingClick} style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>Pricing</span>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>Art Styles</span>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>Explore Feed</span>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>Release Notes</span>
          </div>

          {/* Column 2: Resources */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
            <h4 style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Resources</h4>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>API Beta Access</span>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>Help Center</span>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>Status Page</span>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>Guidelines</span>
          </div>

          {/* Column 3: Legal */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
            <h4 style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Legal</h4>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>Privacy Policy</span>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>Terms of Service</span>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>DMCA / Copyright</span>
            <span style={footerLinkStyle} onMouseEnter={footerHover} onMouseLeave={footerLeave}>Security Policy</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          width: "100%",
          borderTop: "1px solid var(--border)",
          paddingTop: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            &copy; {new Date().getFullYear()} Khicho.AI. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
              Designed & Developed with <Heart size={12} fill="#ef4444" style={{ color: "#ef4444", display: "inline-block", margin: "0 2px", verticalAlign: "middle" }} /> in India
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
