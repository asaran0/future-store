import { useState, useEffect } from "react";
import { useStore } from "../../store/StoreContext";
import {
  AdminCard, AdminField, AdminTextarea, AdminSelect,
  ApiError, ApiSuccess, toSlug,
} from "../../components/admin/AdminFields";
import { getStartingPrice } from "../../services/productService";

// ── Add Product form ─────────────────────────────────────────
function AddProductForm({ categories, onCreated }) {
  const { actions } = useStore();

  const EMPTY = { sku: "", slug: "", name: "", description: "", category_id: "", brand: "" };
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState(null);
  const [success, setSuccess] = useState(null);

  const rootCats = categories.filter((c) => !c.parent_id);
  const catOptions = categories.map((c) => ({
    value: c.id,
    label: c.parent_id
      ? `  └ ${c.name}`
      : c.name,
  }));

  const set = (field, val) => {
    setForm((f) => {
      const next = { ...f, [field]: val };
      if (field === "name" && !f.slug) next.slug = toSlug(val);
      return next;
    });
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.sku.trim())       e.sku  = "SKU is required";
    if (!form.name.trim())      e.name = "Name is required";
    if (!form.slug.trim())      e.slug = "Slug is required";
    if (!form.category_id)      e.category_id = "Select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.createProduct({
      sku:         form.sku.trim(),
      slug:        form.slug.trim(),
      name:        form.name.trim(),
      description: form.description.trim(),
      category_id: form.category_id,
      brand:       form.brand.trim(),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(`Product "${res.data.name}" created with ID ${res.data.id}`);
      setForm(EMPTY);
      onCreated?.(res.data);
    } else {
      setApiErr(res.error);
    }
  };

  return (
    <div className="adm-form-stack">
      <ApiError   message={apiErr}  onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />

      {/* Row 1 */}
      <div className="adm-form-row">
        <AdminField label="SKU"       name="sku"  placeholder="e.g. PHN-X100-BASE" value={form.sku}  onChange={set} error={errors.sku}  required hint="Unique product identifier" />
        <AdminField label="Brand"     name="brand" placeholder="e.g. QuantumTech"  value={form.brand} onChange={set} />
      </div>

      {/* Row 2 */}
      <AdminField label="Product Name" name="name" placeholder="e.g. Quantum Phone X100" value={form.name} onChange={set} error={errors.name} required />

      {/* Row 3 */}
      <div className="adm-form-row">
        <AdminField label="Slug" name="slug" placeholder="auto-generated" value={form.slug} onChange={set} error={errors.slug} hint="URL-friendly identifier" required />
        <AdminSelect
          label="Category"
          name="category_id"
          value={form.category_id}
          onChange={set}
          options={catOptions}
          placeholder="— Select category —"
          error={errors.category_id}
          required
        />
      </div>

      {/* Description */}
      <AdminTextarea
        label="Description"
        name="description"
        placeholder="Describe the product…"
        value={form.description}
        onChange={set}
        rows={3}
      />

      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "⚡ Create Product"}
      </button>
    </div>
  );
}

// ── Products table ───────────────────────────────────────────
function ProductsTable({ products, onManage }) {
  if (products.length === 0) {
    return (
      <div className="adm-empty-inline">
        <span>📭</span> No products yet. Add your first product above.
      </div>
    );
  }

  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Variants</th>
            <th>Media</th>
            <th>Price from</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const price = getStartingPrice(p);
            return (
              <tr key={p.id}>
                <td>
                  <div className="adm-table-name">{p.name}</div>
                  <div className="adm-table-sub adm-mono">{p.slug}</div>
                </td>
                <td><span className="adm-mono">{p.sku}</span></td>
                <td>{p.brand || <span className="adm-muted">—</span>}</td>
                <td className="adm-muted" style={{ fontSize: ".72rem" }}>{p.category_id?.slice(0,8)}…</td>
                <td>
                  <span className="adm-badge-neutral">{p.ProductVariants?.length || 0}</span>
                </td>
                <td>
                  <span className="adm-badge-neutral">{p.ProductMedia?.length || 0}</span>
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
                  <button className="adm-btn-ghost" onClick={() => onManage(p)}>
                    Manage →
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function ProductsPage({ setAdminPage }) {
  const { state, actions, dispatch } = useStore();
  const { products, categories } = state;
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!products.data.length   && !products.loading)   actions.fetchProducts();
    if (!categories.data.length && !categories.loading) actions.fetchCategories();
  }, []);

  const filtered = search
    ? products.data.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()) ||
          p.brand?.toLowerCase().includes(search.toLowerCase())
      )
    : products.data;

  const handleManage = (product) => {
    dispatch({ type: "ADMIN_SELECT_PRODUCT", payload: product });
    setAdminPage("product-detail");
  };

  return (
    <div className="adm-page">
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">Products</div>
          <div className="adm-page-sub">
            {products.data.length} products in catalog
          </div>
        </div>
        <button className="adm-btn-outline" onClick={actions.fetchProducts}>↻ Refresh</button>
      </div>

      {/* Add product form */}
      <AdminCard title="Add New Product" subtitle="Fill in the details to create a new product in your catalog">
        {categories.data.length === 0 && !categories.loading ? (
          <div className="adm-api-error" style={{ marginBottom: "1rem" }}>
            ⚠ No categories found. <span className="adm-link" onClick={() => setAdminPage("categories")}>Create a category first</span>
          </div>
        ) : null}
        <AddProductForm categories={categories.data} onCreated={(p) => handleManage(p)} />
      </AdminCard>

      {/* Products table */}
      <AdminCard
        title="All Products"
        subtitle={`${filtered.length} of ${products.data.length} shown`}
        action={
          <div className="adm-search-bar">
            <span>🔍</span>
            <input
              className="adm-search-input"
              placeholder="Search name, SKU, brand…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <span className="adm-search-clear" onClick={() => setSearch("")}>✕</span>
            )}
          </div>
        }
      >
        {products.loading ? (
          <div className="adm-skeleton-list">
            {[1,2,3,4].map(i => <div key={i} className="adm-skeleton" style={{ height: 52, borderRadius: 6 }} />)}
          </div>
        ) : (
          <ProductsTable products={filtered} onManage={handleManage} />
        )}
      </AdminCard>
    </div>
  );
}
