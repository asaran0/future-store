import { useState, useEffect, useRef } from "react";
import { useStore } from "../store/StoreContext";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import { HERO_SLIDES, INDUSTRIES, FEATURES, TESTIMONIALS, PRODUCTS as STATIC_PRODUCTS } from "../data/foxfury";

// ── Animated Hero ─────────────────────────────────────────────
function HeroSection({ setPage }) {
  const [slide, setSlide] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer.current);
  }, []);

  const s = HERO_SLIDES[slide];

  return (
    <section className="ff-hero" style={{ background: s.bg }}>
      <div className="ff-hero-grid" />
      <div className="ff-hero-glow" />

      <div className="ff-hero-content" key={slide}>
        <div className="ff-hero-eyebrow">
          <span className="ff-hero-eyebrow-dot" />
          {s.eyebrow}
        </div>

        <h1 className="ff-hero-title">
          {s.title}<br />
          <span className="ff-hero-accent">{s.titleAccent}</span>
        </h1>

        <p className="ff-hero-sub">{s.sub}</p>

        <div className="ff-hero-actions">
          <button className="ff-btn-yellow-lg" onClick={() => setPage("shop")}>
            {s.cta}
          </button>
          <button className="ff-btn-outline-lg" onClick={() => setPage("shop")}>
            EXPLORE ALL PRODUCTS
          </button>
        </div>

        <div className="ff-hero-stats">
          {[s.stat1, s.stat2, s.stat3].map(([val, lbl]) => (
            <div key={lbl} className="ff-stat">
              <div className="ff-stat-val">{val}</div>
              <div className="ff-stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide dots */}
      <div className="ff-hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            className={`ff-hero-dot ${i === slide ? "active" : ""}`}
            onClick={() => { setSlide(i); clearInterval(timer.current); }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="ff-scroll-hint">▼</div>
    </section>
  );
}

// ── Industry cards ────────────────────────────────────────────
function IndustriesSection({ setPage, setActiveIndustry }) {
  return (
    <section className="ff-section">
      <div className="ff-section-header">
        <div>
          <div className="ff-section-eyebrow">APPLICATION-SPECIFIC SOLUTIONS</div>
          <div className="ff-section-heading">SHOP BY INDUSTRY</div>
        </div>
        <button className="ff-see-all" onClick={() => setPage("shop")}>VIEW ALL →</button>
      </div>
      <div className="ff-industry-grid">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind.id}
            className="ff-industry-card"
            onClick={() => { setActiveIndustry(ind.id); setPage("shop"); }}
          >
            <div className="ff-industry-icon" style={{ color: `#${ind.color}` }}>{ind.icon}</div>
            <div className="ff-industry-label">{ind.label}</div>
            <div className="ff-industry-desc">{ind.desc}</div>
            <div className="ff-industry-features">
              {ind.features.map((f) => <span key={f} className="ff-ind-tag">{f}</span>)}
            </div>
            <div className="ff-industry-cta">SHOP NOW →</div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Featured products ─────────────────────────────────────────
function FeaturedProducts({ setPage }) {
  const { state, actions } = useStore();
  const { products } = state;

  useEffect(() => {
    if (!products.data.length && !products.loading && !products.error) actions.fetchProducts();
  }, []);

  // API is the source of truth; static catalog only on actual API failure.
  const usingFallback = Boolean(products.error);
  const list = usingFallback
    ? STATIC_PRODUCTS.filter((p) => p.badge).slice(0, 4)
    : products.data.slice(0, 4);

  return (
    <section className="ff-section ff-section-dark">
      <div className="ff-section-header">
        <div>
          <div className="ff-section-eyebrow">INDUSTRY LEADING TECHNOLOGY</div>
          <div className="ff-section-heading">FEATURED PRODUCTS</div>
        </div>
        <button className="ff-see-all" onClick={() => setPage("shop")}>VIEW ALL →</button>
      </div>

      {usingFallback && (
        <div className="ff-fallback-notice" style={{ marginBottom: "1.5rem" }}>
          <span>⚠ Live API unavailable — showing demo catalog.</span>
          <button className="ff-btn-outline-sm" onClick={actions.fetchProducts}>↻ RETRY API</button>
        </div>
      )}

      <div className="ff-grid">
        {products.loading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : list.length > 0
            ? list.map((p) => <ProductCard key={p.id} product={p} />)
            : (
              <div className="ff-empty-grid">
                <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>📭</div>
                <div className="ff-empty-title">No products yet</div>
                <div className="ff-empty-sub">Check back soon, or add products via the admin panel.</div>
              </div>
            )
        }
      </div>
    </section>
  );
}

// ── Nomad spotlight banner ────────────────────────────────────
function NomadBanner({ setPage }) {
  return (
    <section className="ff-banner">
      <div className="ff-banner-glow" />
      <div className="ff-banner-content">
        <div className="ff-banner-eyebrow">FLAGSHIP PRODUCT</div>
        <div className="ff-banner-title">Nomad® 360 Scene Light</div>
        <div className="ff-banner-sub">
          The world's best self-contained portable scene light. Battery operated with built-in tripod legs.
          Up to 8,800 lumens. Extends to 8.5 ft. Runs for 24 hours.
        </div>
        <div className="ff-banner-specs">
          {["360° / Flood / Spot", "8,800 Lumens", "24hr Runtime", "8.5ft Tall", "IP67 Waterproof", "Deploy in 20 Seconds"].map((s) => (
            <span key={s} className="ff-banner-spec">✓ {s}</span>
          ))}
        </div>
        <button className="ff-btn-yellow-lg" onClick={() => setPage("shop")}>
          SHOP NOMAD LIGHTS
        </button>
      </div>
      <div className="ff-banner-visual">
        <div className="ff-banner-emoji">💡</div>
        <div className="ff-banner-ring ff-banner-ring-1" />
        <div className="ff-banner-ring ff-banner-ring-2" />
        <div className="ff-banner-ring ff-banner-ring-3" />
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section className="ff-section">
      <div className="ff-section-header">
        <div>
          <div className="ff-section-eyebrow">TRUSTED WORLDWIDE</div>
          <div className="ff-section-heading">WHAT PROFESSIONALS SAY</div>
        </div>
      </div>
      <div className="ff-testimonial-grid">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="ff-testimonial-card">
            <div className="ff-testimonial-stars">★★★★★</div>
            <blockquote className="ff-testimonial-text">"{t.text}"</blockquote>
            <div className="ff-testimonial-footer">
              <div className="ff-testimonial-avatar">{t.role[0]}</div>
              <div>
                <div className="ff-testimonial-role">{t.role}</div>
                <div className="ff-testimonial-dept">{t.dept}</div>
                <div className="ff-testimonial-product">Product: {t.product}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Feature strip ─────────────────────────────────────────────
function FeaturesStrip() {
  return (
    <div className="ff-features-strip">
      {FEATURES.map((f) => (
        <div key={f.title} className="ff-feature">
          <div className="ff-feature-icon">{f.icon}</div>
          <div>
            <div className="ff-feature-title">{f.title}</div>
            <div className="ff-feature-desc">{f.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer className="ff-footer">
      <div className="ff-footer-grid">
        <div className="ff-footer-brand">
          <div className="ff-footer-logo">
            <span className="ff-logo-fox">FOX</span><span className="ff-logo-fury" style={{ color: "var(--accent)" }}>FURY</span>
          </div>
          <div className="ff-footer-tagline">
            Innovative Solutions for All Your Safety Lighting Needs.
            When seconds count and lives are on the line — FoxFury has the tools you need.
          </div>
          <div className="ff-footer-tagline" style={{ marginTop: ".5rem", fontSize: ".68rem" }}>
            Designed in California · Manufactured with highest quality USA and foreign parts.
          </div>
        </div>

        {[
          { title: "SHOP BY INDUSTRY", links: [["Fire / EMS / Disaster","shop"],["Law Enforcement","shop"],["Forensics","shop"],["Military","shop"],["Industrial","shop"],["Drones","shop"]] },
          { title: "PRODUCTS",         links: [["Scene Lights","shop"],["Headlamps","shop"],["Flashlights","shop"],["Shield Lights","shop"],["Area Lights","shop"],["Drone Lights","shop"]] },
          { title: "COMPANY",          links: [["About FoxFury","home"],["Find a Dealer","home"],["Become a Dealer","home"],["Contact Us","home"],["Warranty & RMA","home"],["Webinars","home"]] },
        ].map((col) => (
          <div key={col.title}>
            <div className="ff-footer-col-title">{col.title}</div>
            {col.links.map(([label, pg]) => (
              <button key={label} className="ff-footer-link" onClick={() => setPage(pg)}>{label}</button>
            ))}
          </div>
        ))}
      </div>

      <div className="ff-footer-bottom">
        <div className="ff-footer-copy">© 2026 FoxFury Lighting Solutions · All Rights Reserved · Designed in California</div>
        <div className="ff-footer-socials">
          {["𝕏", "f", "in", "yt", "ig"].map((s) => (
            <div key={s} className="ff-social">{s}</div>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function HomePage({ setPage, setActiveIndustry }) {
  return (
    <div className="ff-page">
      <HeroSection setPage={setPage} />
      <FeaturesStrip />
      <IndustriesSection setPage={setPage} setActiveIndustry={setActiveIndustry || (() => {})} />
      <FeaturedProducts setPage={setPage} />
      <NomadBanner setPage={setPage} />
      <TestimonialsSection />
      <Footer setPage={setPage} />
    </div>
  );
}
