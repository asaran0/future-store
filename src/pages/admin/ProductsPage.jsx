import { useState, useEffect } from "react";
import { useStore } from "../../store/StoreContext";
import { AdminCard, AdminField, AdminTextarea, AdminSelect, ApiError, ApiSuccess, toSlug } from "../../components/admin/AdminFields";
import { getStartingPrice } from "../../services/productService";

function AddProductForm({ categories, onCreated }) {
  const { actions } = useStore();
  const EMPTY = { sku:"", slug:"", name:"", description:"", category_id:"", brand:"" };
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState(null);
  const [success, setSuccess] = useState(null);

  const set = (f, v) => {
    setForm((p) => { const n = { ...p, [f]: v }; if (f === "name" && !p.slug) n.slug = toSlug(v); return n; });
    setErrors((e) => ({ ...e, [f]: null }));
  };
  const validate = () => {
    const e = {};
    if (!form.sku.trim())      e.sku         = "SKU required";
    if (!form.name.trim())     e.name        = "Name required";
    if (!form.slug.trim())     e.slug        = "Slug required";
    if (!form.category_id)     e.category_id = "Select a category";
    setErrors(e); return !Object.keys(e).length;
  };
  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.createProduct({ sku: form.sku.trim(), slug: form.slug.trim(), name: form.name.trim(), description: form.description.trim(), category_id: form.category_id, brand: form.brand.trim() });
    setLoading(false);
    if (res.ok) { setSuccess(`Product "${res.data.name}" created!`); setForm(EMPTY); onCreated?.(res.data); }
    else setApiErr(res.error);
  };

  return (
    <div className="adm-form-stack">
      <ApiError message={apiErr} onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />
      <div className="adm-form-row">
        <AdminField label="SKU" name="sku" placeholder="e.g. FF-NOMAD-360" value={form.sku} onChange={set} error={errors.sku} required />
        <AdminField label="Brand" name="brand" placeholder="e.g. FoxFury" value={form.brand} onChange={set} />
      </div>
      <AdminField label="Product Name" name="name" placeholder="e.g. Nomad® 360 Scene Light" value={form.name} onChange={set} error={errors.name} required />
      <div className="adm-form-row">
        <AdminField label="Slug" name="slug" placeholder="auto-generated" value={form.slug} onChange={set} error={errors.slug} required />
        <AdminSelect label="Category" name="category_id" value={form.category_id} onChange={set}
          options={categories.map((c) => ({ value: c.id, label: c.parent_id ? `  └ ${c.name}` : c.name }))}
          placeholder="— Select category —" required />
      </div>
      <AdminTextarea label="Description" name="description" placeholder="Describe the product…" value={form.description} onChange={set} rows={3} />
      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "⚡ Create Product"}
      </button>
    </div>
  );
}

export default function ProductsPage({ setAdminPage }) {
  const { state, actions, dispatch } = useStore();
  const { products, categories } = state;
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!products.data.length   && !products.loading)   actions.fetchProducts();
    if (!categories.data.length && !categories.loading) actions.fetchCategories();
  }, []);

  const filtered = search
    ? products.data.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()))
    : products.data;

  const handleManage = (product) => {
    dispatch({ type: "ADMIN_SELECT_PRODUCT", payload: product });
    setAdminPage("product-detail");
  };

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">Products</div>
          <div className="adm-page-sub">{products.data.length} products via GET /api/products</div>
        </div>
        <button className="adm-btn-outline" onClick={actions.fetchProducts}>↻ Refresh</button>
      </div>

      {products.error && (
        <div className="adm-api-error" style={{ marginBottom:"1.5rem" }}>
          ✕ {products.error}
          <button className="adm-api-error-close" onClick={actions.fetchProducts}>Retry</button>
        </div>
      )}

      <AdminCard title="Add New Product" subtitle="POST /api/products  · { sku, slug, name, description, category_id, brand }">
        {categories.data.length === 0 && !categories.loading && (
          <div className="adm-api-error" style={{ marginBottom:"1rem" }}>⚠ No categories — <span className="adm-link" onClick={() => setAdminPage("categories")}>create one first</span></div>
        )}
        <AddProductForm categories={categories.data} onCreated={handleManage} />
      </AdminCard>

      <AdminCard
        title={`All Products (${filtered.length})`}
        subtitle="GET /api/products → Product[] with ProductVariants[] and ProductMedia[]"
        action={
          <div className="adm-search-bar">
            <span>🔍</span>
            <input className="adm-search-input" placeholder="Search name, SKU, brand…" value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && <span className="adm-search-clear" onClick={() => setSearch("")}>✕</span>}
          </div>
        }
      >
        {products.loading ? (
          <div className="adm-skeleton-list">{[1,2,3,4].map(i => <div key={i} className="adm-skeleton" style={{height:52,borderRadius:4}} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty-inline"><span>📭</span> No products found.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Product</th><th>SKU</th><th>Brand</th><th>Variants</th><th>Media</th><th>Price</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map((p) => {
                  const price = getStartingPrice(p);
                  return (
                    <tr key={p.id}>
                      <td><div className="adm-table-name">{p.name}</div><div className="adm-table-sub adm-mono">{p.slug}</div></td>
                      <td><span className="adm-mono">{p.sku}</span></td>
                      <td>{p.brand || <span className="adm-muted">—</span>}</td>
                      <td><span className="adm-badge-neutral">{p.ProductVariants?.length || 0}</span></td>
                      <td><span className="adm-badge-neutral">{p.ProductMedia?.length || 0}</span></td>
                      <td>{price ? <span className="adm-price">${parseFloat(price).toFixed(2)}</span> : <span className="adm-muted">—</span>}</td>
                      <td><span className={`adm-badge ${p.status==="active"?"success":"neutral"}`}>{p.status}</span></td>
                      <td><button className="adm-btn-ghost" onClick={() => handleManage(p)}>Manage →</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
