import { useState, useEffect } from "react";
import { useStore } from "../../store/StoreContext";
import {
  AdminCard, AdminField, AdminSelect, ApiError, ApiSuccess, toSlug,
} from "../../components/admin/AdminFields";

// ── Add Category form ────────────────────────────────────────
function AddCategoryForm({ onSuccess }) {
  const { actions } = useStore();
  const [form,    setForm]    = useState({ name: "", slug: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState(null);
  const [success, setSuccess] = useState(null);

  const set = (field, val) => {
    setForm((f) => {
      const next = { ...f, [field]: val };
      if (field === "name") next.slug = toSlug(val);
      return next;
    });
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.createCategory({ name: form.name.trim(), slug: form.slug.trim() });
    setLoading(false);
    if (res.ok) {
      setSuccess(`Category "${res.data.name}" created!`);
      setForm({ name: "", slug: "" });
      onSuccess?.(res.data);
    } else {
      setApiErr(res.error);
    }
  };

  return (
    <div className="adm-form-stack">
      <ApiError   message={apiErr}  onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />
      <div className="adm-form-row">
        <AdminField label="Category Name" name="name" placeholder="e.g. Electronics" value={form.name} onChange={set} error={errors.name} required />
        <AdminField label="Slug"          name="slug" placeholder="e.g. electronics"  value={form.slug} onChange={set} error={errors.slug} hint="Auto-generated from name" required />
      </div>
      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "+ Create Category"}
      </button>
    </div>
  );
}

// ── Add Subcategory form ─────────────────────────────────────
function AddSubcategoryForm({ categories, onSuccess }) {
  const { actions } = useStore();
  const [form,    setForm]    = useState({ parent_id: "", name: "", slug: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState(null);
  const [success, setSuccess] = useState(null);

  const rootCats = categories.filter((c) => !c.parent_id);

  const set = (field, val) => {
    setForm((f) => {
      const next = { ...f, [field]: val };
      if (field === "name") {
        const parent = rootCats.find((c) => c.id === f.parent_id);
        const prefix = parent ? parent.slug + "-" : "";
        next.slug = prefix + toSlug(val);
      }
      return next;
    });
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.parent_id) e.parent_id = "Select a parent category";
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.createCategory({
      parent_id: form.parent_id,
      name:      form.name.trim(),
      slug:      form.slug.trim(),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(`Subcategory "${res.data.name}" created!`);
      setForm({ parent_id: form.parent_id, name: "", slug: "" });
      onSuccess?.(res.data);
    } else {
      setApiErr(res.error);
    }
  };

  return (
    <div className="adm-form-stack">
      <ApiError   message={apiErr}  onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />
      <AdminSelect
        label="Parent Category"
        name="parent_id"
        value={form.parent_id}
        onChange={set}
        options={rootCats.map((c) => ({ value: c.id, label: c.name }))}
        placeholder="— Select parent —"
        error={errors.parent_id}
        required
      />
      <div className="adm-form-row">
        <AdminField label="Subcategory Name" name="name" placeholder="e.g. Smartphones" value={form.name} onChange={set} error={errors.name} required />
        <AdminField label="Slug"             name="slug" placeholder="auto-generated"   value={form.slug} onChange={set} error={errors.slug} hint="Auto-generated" required />
      </div>
      <button className="adm-btn-primary" onClick={submit} disabled={loading || !rootCats.length}>
        {loading ? <span className="fs-spin">↻</span> : "+ Create Subcategory"}
      </button>
    </div>
  );
}

// ── Category tree ────────────────────────────────────────────
function CategoryTree({ categories }) {
  const rootCats = categories.filter((c) => !c.parent_id);

  if (rootCats.length === 0) {
    return (
      <div className="adm-empty-inline">
        <span>📂</span> No categories yet. Create your first one above.
      </div>
    );
  }

  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Type</th>
            <th>Parent</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const parent = categories.find((c) => c.id === cat.parent_id);
            return (
              <tr key={cat.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                    {cat.parent_id && <span style={{ color: "var(--muted)", fontSize: ".7rem" }}>└─</span>}
                    <span className="adm-table-name">{cat.name}</span>
                  </div>
                </td>
                <td><span className="adm-mono">{cat.slug}</span></td>
                <td>
                  <span className={`adm-badge ${cat.parent_id ? "neutral" : "accent"}`}>
                    {cat.parent_id ? "Sub" : "Root"}
                  </span>
                </td>
                <td className="adm-muted">{parent?.name || "—"}</td>
                <td>
                  <span className={`adm-badge ${cat.is_active ? "success" : "neutral"}`}>
                    {cat.is_active ? "Active" : "Inactive"}
                  </span>
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
export default function CategoriesPage() {
  const { state, actions } = useStore();
  const { categories } = state;

  useEffect(() => {
    if (!categories.data.length && !categories.loading) actions.fetchCategories();
  }, []);

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">Categories</div>
          <div className="adm-page-sub">
            {categories.data.length} total · {categories.data.filter(c => !c.parent_id).length} root · {categories.data.filter(c => c.parent_id).length} sub
          </div>
        </div>
        <button className="adm-btn-outline" onClick={actions.fetchCategories}>↻ Refresh</button>
      </div>

      {/* Two-column forms */}
      <div className="adm-two-col">
        <AdminCard title="Add Category" subtitle="Create a new top-level category">
          <AddCategoryForm />
        </AdminCard>

        <AdminCard title="Add Subcategory" subtitle="Add a subcategory under an existing one">
          <AddSubcategoryForm categories={categories.data} />
        </AdminCard>
      </div>

      {/* Category list */}
      <AdminCard
        title="All Categories"
        subtitle={`${categories.data.length} categories total`}
      >
        {categories.loading ? (
          <div className="adm-skeleton-list">
            {[1,2,3,4,5].map(i => <div key={i} className="adm-skeleton" style={{ height: 44, borderRadius: 6 }} />)}
          </div>
        ) : (
          <CategoryTree categories={categories.data} />
        )}
      </AdminCard>
    </div>
  );
}
