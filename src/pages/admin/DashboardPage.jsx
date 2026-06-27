import { useEffect } from "react";
import { useStore } from "../../store/StoreContext";
import { StatCard, AdminCard } from "../../components/admin/AdminFields";
import { getStartingPrice } from "../../services/productService";

export default function DashboardPage({ setAdminPage }) {
  const { state, actions } = useStore();
  const { products, categories, industries, warehouses } = state;

  useEffect(() => {
    if (!products.data.length   && !products.loading)   actions.fetchProducts();
    if (!categories.data.length && !categories.loading) actions.fetchCategories();
    if (!industries.data.length && !industries.loading) actions.fetchIndustries();
    if (!warehouses.data.length)                        actions.fetchWarehouses();
  }, []);

  const totalVariants = products.data.reduce((s, p) => s + (p.ProductVariants?.length || 0), 0);
  const totalMedia    = products.data.reduce((s, p) => s + (p.ProductMedia?.length    || 0), 0);

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">Dashboard</div>
          <div className="adm-page-sub">Welcome back, {state.user?.first_name}. Here's your FoxFury store overview.</div>
        </div>
        <div style={{ display:"flex", gap:".6rem" }}>
          <button className="adm-btn-outline" onClick={() => { actions.fetchProducts(); actions.fetchCategories(); actions.fetchIndustries(); }}>↻ Refresh</button>
          <button className="adm-btn-primary" onClick={() => setAdminPage("products")}>+ Add Product</button>
        </div>
      </div>

      {/* API error alerts */}
      {products.error   && <div className="adm-api-error" style={{marginBottom:"1rem"}}>⚠ Products API: {products.error}</div>}
      {categories.error && <div className="adm-api-error" style={{marginBottom:"1rem"}}>⚠ Categories API: {categories.error}</div>}
      {industries.error && <div className="adm-api-error" style={{marginBottom:"1rem"}}>⚠ Industries API: {industries.error}</div>}

      {/* Stats */}
      <div className="adm-stats-grid">
        <StatCard icon="📦" label="Products"   value={products.loading   ? "…" : products.data.length}    sub="in catalog"            color="var(--accent)"  />
        <StatCard icon="◈"  label="Categories" value={categories.loading ? "…" : categories.data.length}  sub="with subcategories"    color="var(--accent2)" />
        <StatCard icon="⬡"  label="Industries" value={industries.loading ? "…" : industries.data.length}  sub="industry segments"     color="var(--accent3)" />
        <StatCard icon="⚡"  label="Variants"   value={products.loading   ? "…" : totalVariants}           sub="across all products"   color="var(--warning)" />
        <StatCard icon="🖼"  label="Media"      value={products.loading   ? "…" : totalMedia}              sub="images & videos"       color="var(--success)" />
        <StatCard icon="🏭"  label="Warehouses" value={warehouses.data.length || "…"}                      sub="active locations"      color="var(--subtle)"  />
      </div>

      {/* Recent products table */}
      <AdminCard
        title="Recent Products"
        subtitle={`${products.data.length} products from GET /api/products`}
        action={<button className="adm-btn-ghost" onClick={() => setAdminPage("products")}>View all →</button>}
      >
        {products.loading ? (
          <div className="adm-skeleton-list">{[1,2,3,4].map((i) => <div key={i} className="adm-skeleton" style={{height:48,borderRadius:4}} />)}</div>
        ) : products.data.length === 0 ? (
          <div className="adm-empty-inline">
            <span>📭</span> No products yet —{" "}
            <span className="adm-link" onClick={() => setAdminPage("products")}>add your first product</span>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Product</th><th>SKU</th><th>Brand</th><th>Variants</th><th>Price From</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {products.data.slice(0, 8).map((p) => {
                  const price = getStartingPrice(p);
                  return (
                    <tr key={p.id}>
                      <td><div className="adm-table-name">{p.name}</div><div className="adm-table-sub adm-mono">{p.slug}</div></td>
                      <td><span className="adm-mono">{p.sku}</span></td>
                      <td>{p.brand || <span className="adm-muted">—</span>}</td>
                      <td><span className="adm-badge-neutral">{p.ProductVariants?.length || 0}</span></td>
                      <td>{price ? <span className="adm-price">${parseFloat(price).toFixed(2)}</span> : <span className="adm-muted">—</span>}</td>
                      <td><span className={`adm-badge ${p.status==="active"?"success":"neutral"}`}>{p.status}</span></td>
                      <td>
                        <button className="adm-btn-ghost" onClick={() => {
                          setAdminPage("product-detail");
                        }}>Manage →</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* Industries from API */}
      <AdminCard
        title="Industries"
        subtitle={`${industries.data.length} from GET /api/industry`}
        action={<button className="adm-btn-ghost" onClick={() => setAdminPage("industries")}>Manage →</button>}
      >
        {industries.loading ? (
          <div className="adm-skeleton-list">{[1,2,3].map((i) => <div key={i} className="adm-skeleton" style={{height:40,borderRadius:4}} />)}</div>
        ) : industries.data.length === 0 ? (
          <div className="adm-empty-inline">
            <span>⬡</span> No industries yet —{" "}
            <span className="adm-link" onClick={() => setAdminPage("industries")}>create one</span>
          </div>
        ) : (
          <div className="adm-cat-grid">
            {industries.data.map((ind) => (
              <div key={ind.id} className="adm-cat-card">
                <div className="adm-cat-card-name">{ind.name}</div>
                <div className="adm-cat-card-slug adm-mono">{ind.slug}</div>
                <span className={`adm-badge ${ind.isActive !== false ? "success" : "neutral"}`}>
                  {ind.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
