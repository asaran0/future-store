import { useEffect, useMemo, useState } from "react";
import { useStore } from "../store/StoreContext";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import { INDUSTRIES, PRODUCTS as STATIC_PRODUCTS } from "../data/foxfury";

const SORT_OPTIONS = [
  { value: "featured",    label: "FEATURED" },
  { value: "price-asc",   label: "PRICE: LOW → HIGH" },
  { value: "price-desc",  label: "PRICE: HIGH → LOW" },
  { value: "name",        label: "NAME A–Z" },
];

export default function ShopPage({ activeIndustry, setActiveIndustry }) {
  const { state, actions, dispatch } = useStore();
  const { products, filters } = state;
  const [productType, setProductType] = useState("all");

  useEffect(() => {
    if (!products.data.length && !products.loading && !products.error) actions.fetchProducts();
  }, []);

  // API is the source of truth. Static catalog is used ONLY when the API call
  // actually failed (products.error set) — never just because data is empty.
  const usingFallback = Boolean(products.error);
  const sourceProducts = usingFallback ? STATIC_PRODUCTS : products.data;

  const filtered = useMemo(() => {
    let list = sourceProducts;

    // Industry filter (from nav or sidebar)
    if (activeIndustry && activeIndustry !== "all") {
      list = list.filter((p) =>
        Array.isArray(p.industry)
          ? p.industry.includes(activeIndustry)
          : p.category_id === activeIndustry
      );
    }

    // Product type
    if (productType !== "all") {
      list = list.filter((p) =>
        (p.category || p.category_id || "").toLowerCase().includes(productType.toLowerCase())
      );
    }

    // Text search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.specs?.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Sort
    if (filters.sort === "price-asc")  list = [...list].sort((a,b) => (parseFloat(a.price||a.ProductVariants?.[0]?.msrp||0)) - (parseFloat(b.price||b.ProductVariants?.[0]?.msrp||0)));
    if (filters.sort === "price-desc") list = [...list].sort((a,b) => (parseFloat(b.price||b.ProductVariants?.[0]?.msrp||0)) - (parseFloat(a.price||a.ProductVariants?.[0]?.msrp||0)));
    if (filters.sort === "name")       list = [...list].sort((a,b) => a.name.localeCompare(b.name));

    return list;
  }, [sourceProducts, activeIndustry, productType, filters]);

  const setFilter = (payload) => dispatch({ type: "SET_FILTER", payload });
  const activeIndustryObj = INDUSTRIES.find((i) => i.id === activeIndustry);

  const PRODUCT_TYPES = ["all","scene-lights","headlamps","flashlights","shield-lights","area-lights","drone-lights","forensic-lights"];

  return (
    <div className="ff-page">
      <div className="ff-shop-hero">
        <div className="ff-shop-hero-content">
          <div className="ff-section-eyebrow">
            {activeIndustryObj ? `SHOP BY INDUSTRY / ${activeIndustryObj.label.toUpperCase()}` : "ALL PRODUCTS"}
          </div>
          <h1 className="ff-shop-title">
            {activeIndustryObj
              ? <><span style={{ color: "var(--accent)" }}>{activeIndustryObj.icon}</span> {activeIndustryObj.label}</>
              : "FoxFury Products"
            }
          </h1>
          {activeIndustryObj && (
            <p className="ff-shop-sub">{activeIndustryObj.desc}</p>
          )}
          {activeIndustryObj?.features && (
            <div className="ff-ind-tags-row">
              {activeIndustryObj.features.map((f) => <span key={f} className="ff-ind-tag">{f}</span>)}
            </div>
          )}
        </div>
      </div>

      <div className="ff-shop-body">
        {/* Sidebar */}
        <aside className="ff-shop-sidebar">
          <div className="ff-sidebar-section">
            <div className="ff-sidebar-title">SHOP BY INDUSTRY</div>
            <button
              className={`ff-sidebar-item ${!activeIndustry || activeIndustry === "all" ? "active" : ""}`}
              onClick={() => setActiveIndustry("all")}
            >
              <span>⬡</span> All Industries
            </button>
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                className={`ff-sidebar-item ${activeIndustry === ind.id ? "active" : ""}`}
                onClick={() => setActiveIndustry(ind.id)}
              >
                <span>{ind.icon}</span> {ind.label}
              </button>
            ))}
          </div>

          <div className="ff-sidebar-section">
            <div className="ff-sidebar-title">PRODUCT TYPE</div>
            {PRODUCT_TYPES.map((type) => (
              <button
                key={type}
                className={`ff-sidebar-item ${productType === type ? "active" : ""}`}
                onClick={() => setProductType(type)}
              >
                {type === "all" ? "⬡ All Types" : `◈ ${type.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())}`}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="ff-shop-main">
          {/* Filter bar */}
          <div className="ff-filter-bar">
            <div className="ff-search-bar">
              <span style={{ color: "var(--muted)" }}>🔍</span>
              <input
                className="ff-search-input"
                placeholder="Search products, specs, SKUs…"
                value={filters.search}
                onChange={(e) => setFilter({ search: e.target.value })}
              />
              {filters.search && (
                <span className="ff-search-clear" onClick={() => setFilter({ search: "" })}>✕</span>
              )}
            </div>

            <select
              className="ff-filter-select"
              value={filters.sort}
              onChange={(e) => setFilter({ sort: e.target.value })}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <div className="ff-result-count">
              {products.loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
            </div>
          </div>

          {/* API fallback notice — shown only when the live API call failed */}
          {usingFallback && (
            <div className="ff-fallback-notice">
              <span>⚠ Live API unavailable — showing demo catalog.</span>
              <button className="ff-btn-outline-sm" onClick={actions.fetchProducts}>↻ RETRY API</button>
            </div>
          )}

          {/* Grid */}
          <div className="ff-grid">
            {products.loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : filtered.length > 0
                ? filtered.map((p) => <ProductCard key={p.id} product={p} />)
                : (
                  <div className="ff-empty-grid">
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔭</div>
                    <div className="ff-empty-title">No products found</div>
                    <div className="ff-empty-sub">
                      {filters.search ? `No results for "${filters.search}"` : "No products in this category"}
                    </div>
                    <button className="ff-btn-yellow" style={{ marginTop: "1.25rem" }}
                      onClick={() => { setActiveIndustry("all"); setFilter({ search: "" }); }}>
                      CLEAR FILTERS
                    </button>
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
