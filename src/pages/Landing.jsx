import { useState, useEffect } from "react";
import Logo from "@components/logo";
import LazyImg from "@components/Lazylmg";
import { HERO_PROMPTS, HIGHLIGHTS } from "../constants";
import { buildImageUrl } from "@utils/imageGen";
import { Sun, Moon } from "lucide-react";

export default function Landing({ onLogin, onSignup, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);

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
        background: scrolled ? "rgba(10,10,10,0.9)" : "rgba(10,10,10,0.6)",
      }}>
        <Logo size="md" />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button className="mj-nav-link" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {["Explore", "Pricing"].map((item) => (
            <span key={item} className="mj-nav-link">{item}</span>
          ))}
          <button className="mj-nav-link" onClick={onLogin}>Sign In</button>
          <button className="mj-cta-btn" onClick={onSignup} style={{ padding: "10px 24px", fontSize: 14 }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mj-landing-hero">
        <h1>
          Explore new<br /><em>ways of creating</em>
        </h1>
        <p>
          Turn your imagination into stunning visuals. Describe anything — we bring it to life.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="mj-cta-btn" onClick={onSignup}>Start Creating</button>
          <button className="mj-ghost-btn" onClick={onLogin}>Sign In</button>
        </div>
      </section>

      {/* Showcase grid */}
      <section className="mj-landing-showcase">
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
      <div className="mj-feature-row">
        {HIGHLIGHTS.map((s, i) => (
          <div key={i} className="mj-feature-item">
            <div className="num">{s.n}</div>
            <div className="label">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <section style={{
        position: "relative", zIndex: 1, textAlign: "center",
        padding: "0 24px 80px",
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
      <footer className="mj-landing-footer">
        <Logo size="sm" />
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          &copy; 2025 Khicho.AI
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "GitHub"].map((l) => (
            <span key={l} style={{ color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
