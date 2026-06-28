import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import { HERO_SLIDES, TESTIMONIALS, FEATURES } from "../data/foxfury";

/* ── Hero ──────────────────────────────────────────────────── */
function Hero() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const timer = useRef(null);
  useEffect(() => {
    timer.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 7000);
    return () => clearInterval(timer.current);
  }, []);
  const s = HERO_SLIDES[slide];

  return (
    <section className="njey-hero">
      {/* Vertical grid lines */}
      <div className="njey-grid-lines" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => <div key={i} className="njey-vline" />)}
      </div>

      {/* Right robot / glow area */}
      <div className="njey-robot-area">
        <div className="njey-robot-glow" />
        <div className="njey-robot-glow-2" />
        <div className="njey-float-label njey-label-top">ARTIFICIAL INTELLIGENCE</div>
        <div className="njey-float-label njey-label-bot">NO EMOTION</div>
        <div className="njey-robot-silhouette" />
      </div>

      {/* Left 3 dots */}
      <div className="njey-ldots" aria-hidden="true">
        {[0,1,2].map(i => <div key={i} className={`njey-ldot ${i===1?"njey-ldot-active":""}`} />)}
      </div>

      {/* Hero text content */}
      <div className="njey-hero-content" key={slide}>
        <div className="njey-eyebrow">
          <span className="njey-eyebrow-accent" />
          <span className="njey-eyebrow-text">{s.titleTop}</span>
        </div>

        <h1 className="njey-title">
          <span className="njey-title-firstletter">{s.titleBig[0]}</span>
          <span className="njey-title-rest">{s.titleBig.slice(1)}</span>
        </h1>

        <div className="njey-para-wrap">
          <div className="njey-para-border" />
          <p className="njey-para">{s.sub}</p>
        </div>

        <button className="njey-cta" onClick={() => navigate("/shop")}>{s.cta}</button>
      </div>

      {/* Slide dots */}
      <div className="njey-slide-dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={`njey-slide-dot ${i===slide?"active":""}`}
            onClick={() => { setSlide(i); clearInterval(timer.current); }} />
        ))}
      </div>

      {/* Social rail */}
      <div className="njey-socials">
        {["Vk","Tw","Fb","In","Be"].map(sn => (
          <div key={sn} className="njey-social">{sn}</div>
        ))}
      </div>

      {/* Bottom cards */}
      <div className="njey-bottom-cards">
        {s.cards.map((card, i) => (
          <div key={i} className="njey-bottom-card">
            <div className="njey-bottom-card-title">{card.title}</div>
            <div className="njey-bottom-card-desc">{card.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Error state ───────────────────────────────────────────── */
function ApiErrorState({ message, onRetry, label }) {
  return (
    <div style={{ textAlign:"center", padding:"4rem 2rem", color:"var(--muted)" }}>
      <div style={{ fontSize:"2rem", marginBottom:"1rem" }}>⚠</div>
      <div style={{ fontFamily:"var(--fontDisplay)", fontSize:".78rem", letterSpacing:".1em", color:"var(--subtle)", marginBottom:".5rem" }}>
        {label} UNAVAILABLE
      </div>
      <div style={{ fontFamily:"var(--fontMono)", fontSize:".65rem", color:"var(--danger)", marginBottom:"1.25rem" }}>
        {message}
      </div>
      <button className="ff-btn-sm" onClick={onRetry}>↻ RETRY</button>
    </div>
  );
}

/* ── Industries — API only ─────────────────────────────────── */
function Industries() {
  const navigate = useNavigate();
  const { state, actions, dispatch } = useStore();
  const { industries } = state;

  useEffect(() => {
    if (!industries.data.length && !industries.loading && !industries.error)
      actions.fetchIndustries();
  }, []);

  return (
    <section className="ff-section">
      <div className="ff-section-header">
        <div>
          <div className="ff-section-eyebrow">APPLICATION-SPECIFIC SOLUTIONS</div>
          <div className="ff-section-heading">SHOP BY INDUSTRY</div>
        </div>
        <button className="ff-see-all" onClick={() => navigate("/shop")}>VIEW ALL →</button>
      </div>

      {industries.loading && (
        <div className="ff-industry-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="ff-skeleton" style={{ height: 175 }} />
          ))}
        </div>
      )}

      {industries.error && (
        <ApiErrorState message={industries.error} onRetry={actions.fetchIndustries} label="INDUSTRIES" />
      )}

      {!industries.loading && !industries.error && industries.data.length === 0 && (
        <div style={{ textAlign:"center", padding:"3rem", color:"var(--muted)", fontFamily:"var(--fontDisplay)", fontSize:".72rem", letterSpacing:".1em" }}>
          NO INDUSTRIES FOUND — Add industries via the admin panel
        </div>
      )}

      {!industries.loading && !industries.error && industries.data.length > 0 && (
        <div className="ff-industry-grid">
          {industries.data.map(ind => (
            <button key={ind.id} className="ff-industry-card"
              onClick={() => { dispatch({ type:"SET_FILTER", payload:{ industryId:ind.id } }); navigate("/shop"); }}>
              <div className="ff-industry-icon">⬡</div>
              <div className="ff-industry-label">{ind.name}</div>
              <div className="ff-industry-desc">{ind.description || "Industry-specific FoxFury lighting solutions."}</div>
              <div className="ff-industry-cta">SHOP NOW →</div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Featured Products — API only ──────────────────────────── */
function FeaturedProducts() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const { products } = state;

  useEffect(() => {
    if (!products.data.length && !products.loading && !products.error)
      actions.fetchProducts();
  }, []);

  return (
    <section className="ff-section ff-section-dark">
      <div className="ff-section-header">
        <div>
          <div className="ff-section-eyebrow">INDUSTRY LEADING TECHNOLOGY</div>
          <div className="ff-section-heading">FEATURED PRODUCTS</div>
        </div>
        <button className="ff-see-all" onClick={() => navigate("/shop")}>VIEW ALL →</button>
      </div>

      {products.error && (
        <ApiErrorState message={products.error} onRetry={actions.fetchProducts} label="PRODUCTS API" />
      )}

      {!products.error && (
        <div className="ff-grid">
          {products.loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.data.length > 0
              ? products.data.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)
              : (
                <div className="ff-empty-grid">
                  <div style={{ fontSize:"2.5rem", marginBottom:".75rem" }}>📭</div>
                  <div className="ff-empty-title">NO PRODUCTS YET</div>
                  <div className="ff-empty-sub">Add products via the admin panel</div>
                </div>
              )
          }
        </div>
      )}
    </section>
  );
}

/* ── Nomad Banner ──────────────────────────────────────────── */
function Banner() {
  const navigate = useNavigate();
  return (
    <section className="ff-banner">
      <div className="ff-banner-glow" />
      <div style={{ position:"relative", zIndex:1 }}>
        <div className="ff-banner-eyebrow">FLAGSHIP PRODUCT</div>
        <div className="ff-banner-title">Nomad® 360 Scene Light</div>
        <div className="ff-banner-sub">
          The world's best self-contained portable scene light. Battery operated, built-in tripod,
          up to 8,800 lumens, extends to 8.5 ft, runs 24 hours.
        </div>
        <div className="ff-banner-specs">
          {["360°/Flood/Spot","8,800 Lumens","24hr Runtime","8.5ft Tall","IP67","Deploy in 20s"].map(s => (
            <span key={s} className="ff-banner-spec">✓ {s}</span>
          ))}
        </div>
        <button className="njey-cta" onClick={() => navigate("/shop")}>SHOP NOMAD LIGHTS</button>
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

/* ── Testimonials ──────────────────────────────────────────── */
function Testimonials() {
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

/* ── Features strip ────────────────────────────────────────── */
function FeaturesStrip() {
  return (
    <div className="ff-features-strip">
      {FEATURES.map(f => (
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

/* ── Footer ────────────────────────────────────────────────── */
function Footer() {
  const navigate = useNavigate();
  const cols = [
    { title:"SHOP BY INDUSTRY", links:["Fire / EMS","Law Enforcement","Forensics","Military","Industrial","Drones"] },
    { title:"PRODUCTS",         links:["Scene Lights","Headlamps","Flashlights","Shield Lights","Area Lights","Drone Lights"] },
    { title:"COMPANY",          links:["About FoxFury","Find a Dealer","Contact Us","Warranty","Webinars","Blog"] },
  ];
  return (
    <footer className="ff-footer">
      <div className="ff-footer-grid">
        <div>
          <div className="ff-footer-logo">
            <span className="ff-logo-fox">FOX</span>
            <span className="ff-logo-fury" style={{ color:"var(--accent)" }}>FURY</span>
          </div>
          <div className="ff-footer-tagline">
            Innovative Solutions for All Your Safety Lighting Needs.
            When seconds count and lives are on the line — FoxFury has the tools you need.
          </div>
        </div>
        {cols.map(col => (
          <div key={col.title}>
            <div className="ff-footer-col-title">{col.title}</div>
            {col.links.map(l => (
              <button key={l} className="ff-footer-link" onClick={() => navigate("/shop")}>{l}</button>
            ))}
          </div>
        ))}
      </div>
      <div className="ff-footer-bottom">
        <div className="ff-footer-copy">© 2026 FoxFury Lighting Solutions · All Rights Reserved · California</div>
        <div className="ff-footer-socials">
          {["𝕏","f","in","yt","ig"].map(s => <div key={s} className="ff-social">{s}</div>)}
        </div>
      </div>
    </footer>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="ff-page">
      <Hero />
      <FeaturesStrip />
      <Industries />
      <FeaturedProducts />
      <Banner />
      <Testimonials />
      <Footer />
    </div>
  );
}
