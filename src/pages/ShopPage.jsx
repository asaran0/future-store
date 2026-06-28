import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";
import { getProductsByIndustry } from "../services/productService";

const SORT_OPTIONS = [
  { value:"featured",   label:"FEATURED" },
  { value:"price-asc",  label:"PRICE: LOW → HIGH" },
  { value:"price-desc", label:"PRICE: HIGH → LOW" },
  { value:"name",       label:"NAME A–Z" },
];

export default function ShopPage() {
  const { state, actions, dispatch } = useStore();
  const { products, industries, categories, filters } = state;
  const [searchParams, setSearchParams] = useSearchParams();

  /* Sync URL → store filter on mount/URL change */
  useEffect(() => {
    const industry = searchParams.get("industry");
    if (industry && industry !== filters.industryId) {
      dispatch({ type:"SET_FILTER", payload:{ industryId: industry } });
    }
  }, [searchParams]);

  /* Sync store filter → URL */
  useEffect(() => {
    const params = {};
    if (filters.industryId) params.industry = filters.industryId;
    if (filters.search)     params.search   = filters.search;
    setSearchParams(params, { replace: true });
  }, [filters.industryId, filters.search]);
  const [industryProducts, setIndustryProducts] = useState(null);
  const [indLoading, setIndLoading] = useState(false);
  const [indError, setIndError]     = useState(null);

  /* Fetch on mount */
  useEffect(() => {
    if (!products.data.length   && !products.loading   && !products.error)   actions.fetchProducts();
    if (!industries.data.length && !industries.loading && !industries.error) actions.fetchIndustries();
    if (!categories.data.length && !categories.loading && !categories.error) actions.fetchCategories();
  }, []);

  /* Fetch products by industry when industryId changes */
  useEffect(() => {
    if (!filters.industryId || filters.industryId === "all") {
      setIndustryProducts(null); setIndError(null); return;
    }
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(filters.industryId);
    if (!isUUID) { setIndustryProducts(null); return; }

    setIndLoading(true); setIndError(null);
    getProductsByIndustry(filters.industryId)
      .then(res => {
        setIndustryProducts(Array.isArray(res?.products) ? res.products : Array.isArray(res) ? res : []);
        setIndLoading(false);
      })
      .catch(err => { setIndError(err.message); setIndustryProducts(null); setIndLoading(false); });
  }, [filters.industryId]);

  /* Source: industry-filtered list OR full product list */
  const baseProducts = industryProducts !== null ? industryProducts : products.data;

  const filtered = useMemo(() => {
    let list = [...baseProducts];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      );
    }
    if (filters.sort === "price-asc")  list.sort((a,b) => parseFloat(a.ProductVariants?.[0]?.msrp||0) - parseFloat(b.ProductVariants?.[0]?.msrp||0));
    if (filters.sort === "price-desc") list.sort((a,b) => parseFloat(b.ProductVariants?.[0]?.msrp||0) - parseFloat(a.ProductVariants?.[0]?.msrp||0));
    if (filters.sort === "name")       list.sort((a,b) => a.name.localeCompare(b.name));
    return list;
  }, [baseProducts, filters.search, filters.sort]);

  const setFilter = p => dispatch({ type:"SET_FILTER", payload:p });

  const activeInd  = industries.data.find(i => i.id === filters.industryId);
  const isLoading  = products.loading || indLoading;
  const rootCats   = categories.data.filter(c => !c.parent_id);

  return (
    <div className="ff-page">
      {/* Shop header */}
      <div className="ff-shop-hero">
        <div className="ff-section-eyebrow">
          {activeInd ? `SHOP / ${activeInd.name.toUpperCase()}` : "ALL PRODUCTS"}
        </div>
        <h1 className="ff-shop-title">
          {activeInd ? activeInd.name : "FoxFury Products"}
        </h1>
        {activeInd?.description && (
          <p className="ff-shop-sub">{activeInd.description}</p>
        )}
      </div>

      <div className="ff-shop-body">
        {/* Sidebar */}
        <aside className="ff-shop-sidebar">
          {/* Industries from API */}
          <div className="ff-sidebar-section">
            <div className="ff-sidebar-title">BY INDUSTRY</div>
            <button
              className={`ff-sidebar-item ${!filters.industryId ? "active" : ""}`}
              onClick={() => setFilter({ industryId: null })}>
              <span>⬡</span> All Industries
            </button>
            {industries.loading ? (
              [1,2,3].map(i => <div key={i} className="ff-skeleton" style={{ height:28, margin:".2rem 0" }} />)
            ) : industries.error ? (
              <div style={{ fontSize:".58rem", color:"var(--danger)", fontFamily:"var(--fontMono)", padding:".4rem .55rem" }}>
                API Error — {industries.error}
              </div>
            ) : (
              industries.data.map(ind => (
                <button key={ind.id}
                  className={`ff-sidebar-item ${filters.industryId === ind.id ? "active" : ""}`}
                  onClick={() => setFilter({ industryId: ind.id })}>
                  <span>◈</span> {ind.name}
                </button>
              ))
            )}
          </div>

          {/* Categories from API */}
          {rootCats.length > 0 && (
            <div className="ff-sidebar-section">
              <div className="ff-sidebar-title">BY CATEGORY</div>
              <button
                className={`ff-sidebar-item ${!filters.categoryId ? "active" : ""}`}
                onClick={() => setFilter({ categoryId: null })}>
                <span>⬡</span> All Categories
              </button>
              {rootCats.map(cat => (
                <button key={cat.id}
                  className={`ff-sidebar-item ${filters.categoryId === cat.id ? "active" : ""}`}
                  onClick={() => setFilter({ categoryId: cat.id })}>
                  <span>◈</span> {cat.name}
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Main */}
        <div className="ff-shop-main">
          {/* API error banners */}
          {products.error && (
            <div className="ff-api-error-banner">
              <span>✕ Products API: {products.error}</span>
              <button className="ff-btn-sm" onClick={actions.fetchProducts}>↻ Retry</button>
            </div>
          )}
          {indError && (
            <div className="ff-api-error-banner">
              <span>✕ Industry filter error: {indError}</span>
              <button className="ff-btn-sm" onClick={() => setFilter({ industryId: null })}>Clear Filter</button>
            </div>
          )}

          {/* Filter bar */}
          <div className="ff-filter-bar">
            <div className="ff-search-bar">
              <span style={{ color:"var(--muted)", fontSize:".82rem" }}>🔍</span>
              <input className="ff-search-input" placeholder="Search products, brand, SKU…"
                value={filters.search}
                onChange={e => setFilter({ search: e.target.value })} />
              {filters.search && (
                <span className="ff-search-clear" onClick={() => setFilter({ search:"" })}>✕</span>
              )}
            </div>
            <select className="ff-filter-select" value={filters.sort}
              onChange={e => setFilter({ sort: e.target.value })}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="ff-result-count">
              {isLoading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
            </div>
          </div>

          {/* Product grid — no static fallback, API only */}
          {!products.error && (
            <div className="ff-grid">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : filtered.length > 0
                  ? filtered.map(p => <ProductCard key={p.id} product={p} />)
                  : (
                    <div className="ff-empty-grid">
                      <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>🔭</div>
                      <div className="ff-empty-title">NO PRODUCTS FOUND</div>
                      <div className="ff-empty-sub">
                        {filters.search ? `No results for "${filters.search}"` : "No products in this selection"}
                      </div>
                      <button className="ff-btn-accent-sm" style={{ marginTop:"1.25rem" }}
                        onClick={() => setFilter({ search:"", industryId:null, categoryId:null })}>
                        CLEAR FILTERS
                      </button>
                    </div>
                  )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
