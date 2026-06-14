import { useEffect } from "react";
import { useStore } from "../store/StoreContext";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";

const FEATURES = [
  { icon: "⚡", title: "Instant Delivery",  desc: "Same-day quantum shipping to all supported regions" },
  { icon: "🔒", title: "Secure Checkout",   desc: "Military-grade encryption on all transactions" },
  { icon: "♻️", title: "Easy Returns",      desc: "30-day no-questions-asked return policy" },
  { icon: "🤖", title: "AI Support",         desc: "24/7 neural-network powered customer assistance" },
];

const FOOTER_COLS = [
  { title: "NAVIGATE", links: ["Home", "Shop", "Wishlist", "Orders"] },
  { title: "COMPANY",  links: ["About", "Careers", "Press", "Blog"] },
  { title: "SUPPORT",  links: ["FAQ", "Shipping", "Returns", "Contact"] },
];

export default function HomePage({ setPage }) {
  const { state, actions } = useStore();
  const { products } = state;

  // Fetch products on first render
  useEffect(() => {
    if (!products.data.length && !products.loading) {
      actions.fetchProducts();
    }
  }, []);

  // Show only first 4 products as "featured"
  const featured = products.data.slice(0, 4);

  return (
    <div className="fs-page">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="fs-hero">
        <div className="fs-hero-grid" />
        <div className="fs-hero-glow" />
        <div className="fs-hero-content">
          <div className="fs-hero-eyebrow">HERE AND NOW</div>
          <h1 className="fs-hero-title">
            THE<br />
            <span className="accent-word">FUTURE</span>
          </h1>
          <p className="fs-hero-sub">
            People who think about the future, about how to improve their lives,
            and take action in this direction, have a plan of action.
          </p>
          <div className="fs-hero-actions">
            <button className="fs-btn-primary" onClick={() => setPage("shop")}>
              LET'S GO →
            </button>
            <button className="fs-btn-outline" onClick={() => setPage("shop")}>
              EXPLORE
            </button>
          </div>
          <div className="fs-hero-stats">
            {[["4.9★", "Rating"], ["12K+", "Products"], ["98%", "Satisfaction"]].map(([v, l]) => (
              <div key={l}>
                <div className="fs-stat-val">{v}</div>
                <div className="fs-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="fs-features">
        <div className="fs-features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="fs-feature">
              <div className="fs-feature-icon">{f.icon}</div>
              <div>
                <div className="fs-feature-title">{f.title}</div>
                <div className="fs-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="fs-section">
        <div className="fs-section-header">
          <div>
            <div className="fs-section-eyebrow">CURATED FOR YOU</div>
            <div className="fs-section-heading">FEATURED TECH</div>
          </div>
          <span className="fs-see-all" onClick={() => setPage("shop")}>
            VIEW ALL →
          </span>
        </div>

        {products.error ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--danger)" }}>
            <div style={{ fontSize: "2rem", marginBottom: ".75rem" }}>⚠</div>
            <div style={{ fontFamily: "var(--fontDisplay)", fontSize: ".8rem", letterSpacing: ".1em" }}>
              {products.error}
            </div>
            <button
              className="fs-btn-outline"
              style={{ marginTop: "1.25rem", height: 38, fontSize: ".62rem", padding: "0 1.25rem" }}
              onClick={() => actions.fetchProducts()}
            >
              RETRY
            </button>
          </div>
        ) : (
          <div className="fs-grid">
            {products.loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.length > 0
                ? featured.map((p) => <ProductCard key={p.id} product={p} />)
                : <p style={{ color: "var(--muted)", fontSize: ".8rem" }}>No products available.</p>
            }
          </div>
        )}
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="fs-footer">
        <div className="fs-footer-grid">
          <div>
            <div className="fs-footer-logo">N.JEY STORE</div>
            <div className="fs-footer-tagline">
              The future is not a destination — it's a direction.
              We supply the gear for the journey.
            </div>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="fs-footer-col-title">{col.title}</div>
              {col.links.map((l) => (
                <a key={l} className="fs-footer-link">{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="fs-footer-bottom">
          <div className="fs-footer-copy">© 2026 N.JEY STORE — ALL RIGHTS RESERVED</div>
          <div className="fs-footer-socials">
            {["𝕏", "f", "in", "yt"].map((s) => (
              <div key={s} className="fs-social">{s}</div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
