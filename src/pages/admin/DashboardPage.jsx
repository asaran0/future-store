import { useEffect } from "react";
import { useStore } from "../../store/StoreContext";
import { StatCard, AdminCard } from "../../components/admin/AdminFields";
import { getStartingPrice } from "../../services/productService";

export default function DashboardPage({ setAdminPage }) {
  const { state, actions } = useStore();
  const { products, categories } = state;

  useEffect(() => {
    if (!products.data.length   && !products.loading)   actions.fetchProducts();
    if (!categories.data.length && !categories.loading) actions.fetchCategories();
  }, []);

  const rootCats  = categories.data.filter((c) => !c.parent_id);
  const subCats   = categories.data.filter((c) =>  c.parent_id);
  const totalVars = products.data.reduce((s, p) => s + (p.ProductVariants?.length || 0), 0);
  const recent    = products.data.slice(0, 6);

  return (
    <div className="adm-page">
      {/* Page header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">Dashboard</div>
          <div className="adm-page-sub">Welcome back, {state.user?.first_name}. Here's your store overview.</div>
        </div>
        <div style={{ display: "flex", gap: ".65rem" }}>
          <button className="adm-btn-outline" onClick={() => { actions.fetchProducts(); actions.fetchCategories(); }}>
            ↻ Refresh
          </button>
          <button className="adm-btn-primary" onClick={() => setAdminPage("products")}>
            + Add Product
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="adm-stats-grid">
        <StatCard icon="📦" label="Total Products"   value={products.loading   ? "…" : products.data.length}   sub="in catalog"            color="var(--accent)" />
        <StatCard icon="◈"  label="Categories"       value={categories.loading ? "…" : rootCats.length}        sub={`${subCats.length} subcategories`} color="var(--accent2)" />
        <StatCard icon="⚡" label="Product Variants"  value={products.loading   ? "…" : totalVars}              sub="across all products"   color="var(--accent3)" />
        <StatCard icon="🖼" label="Media Files"       value={products.loading   ? "…" : products.data.reduce((s,p)=>s+(p.ProductMedia?.length||0),0)} sub="images & videos" color="var(--warning)" />
      </div>

      {/* Recent products */}
      <AdminCard
        title="Recent Products"
        subtitle="Latest items in your catalog"
        action={
          <button className="adm-btn-ghost" onClick={() => setAdminPage("products")}>
            View all →
          </button>
        }
      >
        {products.loading ? (
          <div className="adm-skeleton-list">
            {[1,2,3,4].map(i => <div key={i} className="adm-skeleton" style={{height:52,borderRadius:6}} />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="adm-empty-inline">
            <span>📭</span> No products yet —{" "}
            <span className="adm-link" onClick={() => setAdminPage("products")}>add your first product</span>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Brand</th>
                  <th>Variants</th>
                  <th>Price from</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recent.map((p) => {
                  const price = getStartingPrice(p);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="adm-table-name">{p.name}</div>
                        <div className="adm-table-sub">{p.slug}</div>
                      </td>
                      <td><span className="adm-mono">{p.sku}</span></td>
                      <td>{p.brand || "—"}</td>
                      <td>
                        <span className="adm-badge-neutral">{p.ProductVariants?.length || 0}</span>
                      </td>
                      <td>
                        {price != null
                          ? <span className="adm-price">${parseFloat(price).toFixed(2)}</span>
                          : <span className="adm-muted">—</span>}
                      </td>
                      <td>
                        <span className={`adm-badge ${p.status === "active" ? "success" : "neutral"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="adm-btn-ghost"
                          onClick={() => {
                            setAdminPage("product-detail");
                          }}
                        >
                          Manage →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* Categories overview */}
      <AdminCard
        title="Categories"
        subtitle="Top-level categories and their subcategories"
        action={
          <button className="adm-btn-ghost" onClick={() => setAdminPage("categories")}>
            Manage →
          </button>
        }
      >
        {categories.loading ? (
          <div className="adm-skeleton-list">
            {[1,2,3].map(i => <div key={i} className="adm-skeleton" style={{height:44,borderRadius:6}} />)}
          </div>
        ) : rootCats.length === 0 ? (
          <div className="adm-empty-inline">
            <span>📂</span> No categories yet —{" "}
            <span className="adm-link" onClick={() => setAdminPage("categories")}>create one</span>
          </div>
        ) : (
          <div className="adm-cat-grid">
            {rootCats.map((cat) => {
              const subs = categories.data.filter((c) => c.parent_id === cat.id);
              return (
                <div key={cat.id} className="adm-cat-card">
                  <div className="adm-cat-card-name">{cat.name}</div>
                  <div className="adm-cat-card-slug adm-mono">{cat.slug}</div>
                  {subs.length > 0 && (
                    <div className="adm-cat-subs">
                      {subs.map((s) => (
                        <span key={s.id} className="adm-badge-neutral">{s.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
