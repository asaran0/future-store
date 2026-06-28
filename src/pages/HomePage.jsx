import { useState, useEffect, useRef } from "react";
import { useStore } from "../store/StoreContext";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import { HERO_SLIDES, TESTIMONIALS, FEATURES, STATIC_PRODUCTS, STATIC_INDUSTRIES, INDUSTRY_META } from "../data/foxfury";

/* ─────────────────────────────────────────────────────────────
   HERO — exact match to reference image
   Layout:
   - Transparent nav over full-bleed dark bg
   - Vertical grid lines across full width
   - Left ~50%: eyebrow / giant display title / paragraph / button
   - Right ~50%: robot glow / floating image area
   - Fixed left: 3 vertical dots
   - Fixed right edge: Vk Tw Fb In Be social rail
   - Bottom-right overlay: TECHNOLOGY + INNOVATION cards
   - Right of robot: "ARTIFICIAL INTELLIGENCE" vertical label
   - Lower robot: "NO EMOTION" horizontal label
───────────────────────────────────────────────────────────── */
function Hero({ setPage }) {
  const [slide, setSlide] = useState(0);
  const timer = useRef(null);
  useEffect(() => {
    timer.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 7000);
    return () => clearInterval(timer.current);
  }, []);
  const s = HERO_SLIDES[slide];

  return (
    <section className="njey-hero">
      {/* Vertical grid lines — the defining feature of the reference */}
      <div className="njey-grid-lines" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="njey-vline" />
        ))}
      </div>

      {/* Right side atmospheric glow (where the robot image sits) */}
      <div className="njey-robot-area">
        <div className="njey-robot-glow" />
        <div className="njey-robot-glow-2" />
        {/* Floating label: ARTIFICIAL INTELLIGENCE */}
        <div className="njey-float-label njey-label-top">ARTIFICIAL INTELLIGENCE</div>
        {/* Floating label: NO EMOTION */}
        <div className="njey-float-label njey-label-bot">NO EMOTION</div>
        {/* Robot silhouette using CSS — place a real image here in production */}
        <div className="njey-robot-silhouette" />
      </div>

      {/* Left dots — 3 small vertical dots like the image */}
      <div className="njey-ldots" aria-hidden="true">
        {[0,1,2].map(i => <div key={i} className={`njey-ldot ${i===1?"njey-ldot-active":""}`} />)}
      </div>

      {/* Hero content */}
      <div className="njey-hero-content" key={slide}>
        {/* Eyebrow: HERE AND NOW  — with the blue square accent block */}
        <div className="njey-eyebrow">
          <span className="njey-eyebrow-accent" />
          <span className="njey-eyebrow-text">{s.titleTop}</span>
        </div>

        {/* Giant display title — FUTURE — with accent block behind first letter */}
        <h1 className="njey-title">
          <span className="njey-title-firstletter">{s.titleBig[0]}</span>
          <span className="njey-title-rest">{s.titleBig.slice(1)}</span>
        </h1>

        {/* Left-border paragraph — exactly like the reference */}
        <div className="njey-para-wrap">
          <div className="njey-para-border" />
          <p className="njey-para">{s.sub}</p>
        </div>

        {/* CTA button — outlined, no fill, like "LET'S GO" */}
        <button className="njey-cta" onClick={() => setPage("shop")}>{s.cta}</button>
      </div>

      {/* Slide indicator dots */}
      <div className="njey-slide-dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={`njey-slide-dot ${i===slide?"active":""}`}
            onClick={() => { setSlide(i); clearInterval(timer.current); }} />
        ))}
      </div>

      {/* Social rail — right edge: Vk Tw Fb In Be */}
      <div className="njey-socials">
        {["Vk","Tw","Fb","In","Be"].map(sn => (
          <div key={sn} className="njey-social">{sn}</div>
        ))}
      </div>

      {/* Bottom-right info cards: TECHNOLOGY / INNOVATION */}
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

/* ── Industries from API ───────────────────────────────────── */
function Industries({ setPage }) {
  const { state, actions, dispatch } = useStore();
  const { industries } = state;
  useEffect(() => {
    if (!industries.data.length && !industries.loading && !industries.error) actions.fetchIndustries();
  }, []);
  const usingFallback = Boolean(industries.error);
  const list = usingFallback ? STATIC_INDUSTRIES : industries.data;

  return (
    <section className="ff-section">
      <div className="ff-section-header">
        <div>
          <div className="ff-section-eyebrow">APPLICATION-SPECIFIC SOLUTIONS</div>
          <div className="ff-section-heading">SHOP BY INDUSTRY</div>
        </div>
        <button className="ff-see-all" onClick={() => setPage("shop")}>VIEW ALL →</button>
      </div>
      {usingFallback && (
        <div className="ff-api-warning-banner" style={{ marginBottom:"1.25rem" }}>
          <span>⚠ Industries API unavailable — showing demo data</span>
          <button className="ff-btn-sm" onClick={actions.fetchIndustries}>↻ Retry</button>
        </div>
      )}
      {industries.loading ? (
        <div className="ff-industry-grid">
          {Array.from({ length:6 }).map((_,i) => <div key={i} className="ff-skeleton" style={{height:175}} />)}
        </div>
      ) : (
        <div className="ff-industry-grid">
          {list.map(ind => {
            const meta = INDUSTRY_META[ind.slug] || { icon:"⬡", color:"4f46e5" };
            return (
              <button key={ind.id} className="ff-industry-card"
                onClick={() => { dispatch({ type:"SET_FILTER", payload:{ industryId:ind.id }}); setPage("shop"); }}>
                <div className="ff-industry-icon" style={{ color:`#${meta.color}` }}>{meta.icon}</div>
                <div className="ff-industry-label">{ind.name}</div>
                <div className="ff-industry-desc">{ind.description || "Industry-specific FoxFury lighting."}</div>
                <div className="ff-industry-cta">SHOP NOW →</div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ── Featured products from API ────────────────────────────── */
function FeaturedProducts({ setPage }) {
  const { state, actions } = useStore();
  const { products } = state;
  useEffect(() => {
    if (!products.data.length && !products.loading && !products.error) actions.fetchProducts();
  }, []);
  const usingFallback = Boolean(products.error);
  const list = usingFallback
    ? STATIC_PRODUCTS.filter(p => p.badge).slice(0, 4)
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
        <div className="ff-api-warning-banner" style={{ marginBottom:"1.25rem" }}>
          <span>⚠ Products API unavailable — showing demo catalog</span>
          <button className="ff-btn-sm" onClick={actions.fetchProducts}>↻ Retry</button>
        </div>
      )}
      <div className="ff-grid">
        {products.loading
          ? Array.from({ length:4 }).map((_,i) => <ProductCardSkeleton key={i} />)
          : list.length > 0
            ? list.map(p => <ProductCard key={p.id} product={p} />)
            : (
              <div className="ff-empty-grid">
                <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>📭</div>
                <div className="ff-empty-title">NO PRODUCTS YET</div>
                <div className="ff-empty-sub">Add products via the admin panel</div>
              </div>
            )
        }
      </div>
    </section>
  );
}

/* ── Nomad banner ─────────────────────────────────────────── */
function Banner({ setPage }) {
  return (
    <section className="ff-banner">
      <div className="ff-banner-glow" />
      <div style={{ position:"relative", zIndex:1 }}>
        <div className="ff-banner-eyebrow">FLAGSHIP PRODUCT</div>
        <div className="ff-banner-title">Nomad® 360 Scene Light</div>
        <div className="ff-banner-sub">The world's best self-contained portable scene light. Battery operated, built-in tripod, up to 8,800 lumens, extends to 8.5 ft, runs 24 hours.</div>
        <div className="ff-banner-specs">
          {["360°/Flood/Spot","8,800 Lumens","24hr Runtime","8.5ft Tall","IP67","Deploy in 20s"].map(s => (
            <span key={s} className="ff-banner-spec">✓ {s}</span>
          ))}
        </div>
        <button className="njey-cta" style={{ marginTop:0 }} onClick={() => setPage("shop")}>SHOP NOMAD LIGHTS</button>
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

/* ── Testimonials ─────────────────────────────────────────── */
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

/* ── Features strip ───────────────────────────────────────── */
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

/* ── Footer ───────────────────────────────────────────────── */
function Footer({ setPage }) {
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
            <span className="ff-logo-fox">FOX</span><span className="ff-logo-fury" style={{color:"var(--accent)"}}>FURY</span>
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
              <button key={l} className="ff-footer-link" onClick={() => setPage("shop")}>{l}</button>
            ))}
          </div>
        ))}
      </div>
      <div className="ff-footer-bottom">
        <div className="ff-footer-copy">© 2026 FoxFury Lighting Solutions · All Rights Reserved · Designed in California</div>
        <div className="ff-footer-socials">
          {["𝕏","f","in","yt","ig"].map(s => <div key={s} className="ff-social">{s}</div>)}
        </div>
      </div>
    </footer>
  );
}

export default function HomePage({ setPage }) {
  return (
    <div className="ff-page">
      <Hero setPage={setPage} />
      <FeaturesStrip />
      <Industries setPage={setPage} />
      <FeaturedProducts setPage={setPage} />
      <Banner setPage={setPage} />
      <Testimonials />
      <Footer setPage={setPage} />
    </div>
  );
}
