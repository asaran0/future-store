import { useEffect, useMemo } from "react";
import { useStore } from "../store/StoreContext";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";

export default function ShopPage() {
  const { state, actions, dispatch } = useStore();
  const { products, categories, filters } = state;

  // Fetch data on mount if not already loaded
  useEffect(() => {
    if (!products.data.length   && !products.loading)   actions.fetchProducts();
    if (!categories.data.length && !categories.loading) actions.fetchCategories();
  }, []);

  // Build category pills: "All" + root categories from API
  const rootCategories = useMemo(() => {
    return categories.data.filter((c) => !c.parent_id);
  }, [categories.data]);

  // Filter + sort products
  const filtered = useMemo(() => {
    let list = products.data;

    if (filters.category !== "all") {
      list = list.filter((p) => p.category_id === filters.category);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    if (filters.sort === "price-asc") {
      list = [...list].sort((a, b) => {
        const pa = a.ProductVariants?.[0]?.msrp || 0;
        const pb = b.ProductVariants?.[0]?.msrp || 0;
        return parseFloat(pa) - parseFloat(pb);
      });
    } else if (filters.sort === "price-desc") {
      list = [...list].sort((a, b) => {
        const pa = a.ProductVariants?.[0]?.msrp || 0;
        const pb = b.ProductVariants?.[0]?.msrp || 0;
        return parseFloat(pb) - parseFloat(pa);
      });
    } else if (filters.sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products.data, filters]);

  const setFilter = (payload) => dispatch({ type: "SET_FILTER", payload });
  const isLoading = products.loading || categories.loading;

  return (
    <div className="fs-page">
      <section className="fs-section">
        {/* Header */}
        <div className="fs-section-header">
          <div>
            <div className="fs-section-eyebrow">BROWSE OUR COLLECTION</div>
            <div className="fs-section-heading">
              ALL PRODUCTS{" "}
              {!isLoading && (
                <span style={{ color: "var(--muted)", fontSize: ".95rem" }}>
                  ({filtered.length})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category pills — loaded from API */}
        <div className="fs-cats">
          <button
            className={`fs-cat-pill ${filters.category === "all" ? "active" : ""}`}
            onClick={() => setFilter({ category: "all" })}
          >
            <span>⬡</span> All Products
          </button>

          {categories.loading ? (
            <div style={{ display: "flex", gap: ".5rem" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="fs-skeleton" style={{ width: 90, height: 32, borderRadius: 4 }} />
              ))}
            </div>
          ) : (
            rootCategories.map((cat) => (
              <button
                key={cat.id}
                className={`fs-cat-pill ${filters.category === cat.id ? "active" : ""}`}
                onClick={() => setFilter({ category: cat.id })}
              >
                <span>◈</span> {cat.name}
              </button>
            ))
          )}
        </div>

        {/* Filter bar */}
        <div className="fs-filter-bar">
          <div className="fs-search-bar">
            <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>🔍</span>
            <input
              className="fs-search-input"
              placeholder="Search products, brands, SKUs…"
              value={filters.search}
              onChange={(e) => setFilter({ search: e.target.value })}
            />
            {filters.search && (
              <span
                style={{ color: "var(--muted)", cursor: "pointer", fontSize: ".8rem" }}
                onClick={() => setFilter({ search: "" })}
              >✕</span>
            )}
          </div>

          <select
            className="fs-filter-select"
            value={filters.sort}
            onChange={(e) => setFilter({ sort: e.target.value })}
          >
            <option value="featured">FEATURED</option>
            <option value="price-asc">PRICE: LOW → HIGH</option>
            <option value="price-desc">PRICE: HIGH → LOW</option>
            <option value="name">NAME A–Z</option>
          </select>
        </div>

        {/* Error state */}
        {products.error && (
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
        )}

        {/* Product grid */}
        {!products.error && (
          <div className="fs-grid">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : filtered.length > 0
                ? filtered.map((p) => <ProductCard key={p.id} product={p} />)
                : (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "var(--muted)" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔭</div>
                    <div style={{ fontFamily: "var(--fontDisplay)", letterSpacing: ".1em", marginBottom: ".5rem" }}>
                      NO PRODUCTS FOUND
                    </div>
                    <div style={{ fontSize: ".72rem" }}>
                      {filters.search
                        ? `No results for "${filters.search}"`
                        : "No products in this category yet"}
                    </div>
                    <button
                      className="fs-btn-ghost"
                      style={{ marginTop: "1rem" }}
                      onClick={() => setFilter({ category: "all", search: "" })}
                    >
                      CLEAR FILTERS
                    </button>
                  </div>
                )
            }
          </div>
        )}
      </section>
    </div>
  );
}
