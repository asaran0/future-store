import { useState, useEffect } from "react";
import { useStore } from "../../store/StoreContext";
import { AdminCard, AdminField, AdminSelect, ApiError, ApiSuccess, toSlug } from "../../components/admin/AdminFields";

function AddCategoryForm() {
  const { actions } = useStore();
  const [form, setForm]       = useState({ name: "", slug: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState(null);
  const [success, setSuccess] = useState(null);

  const set = (f, v) => {
    setForm((p) => { const n = { ...p, [f]: v }; if (f === "name") n.slug = toSlug(v); return n; });
    setErrors((e) => ({ ...e, [f]: null }));
  };
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    setErrors(e); return !Object.keys(e).length;
  };
  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.createCategory({ name: form.name.trim(), slug: form.slug.trim() });
    setLoading(false);
    if (res.ok) { setSuccess(`Category "${res.data.name}" created!`); setForm({ name: "", slug: "" }); }
    else setApiErr(res.error);
  };

  return (
    <div className="adm-form-stack">
      <ApiError message={apiErr} onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />
      <div className="adm-form-row">
        <AdminField label="Category Name" name="name" placeholder="e.g. Scene Lights" value={form.name} onChange={set} error={errors.name} required />
        <AdminField label="Slug"          name="slug" placeholder="e.g. scene-lights"  value={form.slug} onChange={set} error={errors.slug} hint="Auto-generated" required />
      </div>
      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "+ Create Category"}
      </button>
    </div>
  );
}

function AddSubcategoryForm({ categories }) {
  const { actions } = useStore();
  const roots = categories.filter((c) => !c.parent_id);
  const [form, setForm]       = useState({ parent_id: "", name: "", slug: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState(null);
  const [success, setSuccess] = useState(null);

  const set = (f, v) => {
    setForm((p) => {
      const n = { ...p, [f]: v };
      if (f === "name") {
        const parent = roots.find((c) => c.id === p.parent_id);
        n.slug = (parent ? parent.slug + "-" : "") + toSlug(v);
      }
      return n;
    });
    setErrors((e) => ({ ...e, [f]: null }));
  };
  const validate = () => {
    const e = {};
    if (!form.parent_id)   e.parent_id = "Select a parent";
    if (!form.name.trim()) e.name      = "Name is required";
    if (!form.slug.trim()) e.slug      = "Slug is required";
    setErrors(e); return !Object.keys(e).length;
  };
  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.createCategory({ parent_id: form.parent_id, name: form.name.trim(), slug: form.slug.trim() });
    setLoading(false);
    if (res.ok) { setSuccess(`Subcategory "${res.data.name}" created!`); setForm({ parent_id: form.parent_id, name: "", slug: "" }); }
    else setApiErr(res.error);
  };

  return (
    <div className="adm-form-stack">
      <ApiError message={apiErr} onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />
      <AdminSelect label="Parent Category" name="parent_id" value={form.parent_id} onChange={set}
        options={roots.map((c) => ({ value: c.id, label: c.name }))} placeholder="— Select parent —" required />
      <div className="adm-form-row">
        <AdminField label="Subcategory Name" name="name" placeholder="e.g. Headlamps" value={form.name} onChange={set} error={errors.name} required />
        <AdminField label="Slug" name="slug" placeholder="auto-generated" value={form.slug} onChange={set} error={errors.slug} required />
      </div>
      <button className="adm-btn-primary" onClick={submit} disabled={loading || !roots.length}>
        {loading ? <span className="fs-spin">↻</span> : "+ Create Subcategory"}
      </button>
    </div>
  );
}

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

      {categories.error && (
        <div className="adm-api-error" style={{ marginBottom:"1.5rem" }}>
          ✕ {categories.error}
          <button className="adm-api-error-close" onClick={actions.fetchCategories}>Retry</button>
        </div>
      )}

      <div className="adm-two-col">
        <AdminCard title="Add Category" subtitle="POST /api/categories  · { name, slug }">
          <AddCategoryForm />
        </AdminCard>
        <AdminCard title="Add Subcategory" subtitle="POST /api/categories  · { parent_id, name, slug }">
          <AddSubcategoryForm categories={categories.data} />
        </AdminCard>
      </div>

      <AdminCard title={`All Categories (${categories.data.length})`} subtitle="GET /api/categories → Category[] with SubCategories[]">
        {categories.loading ? (
          <div className="adm-skeleton-list">{[1,2,3,4,5].map(i => <div key={i} className="adm-skeleton" style={{height:44,borderRadius:4}} />)}</div>
        ) : categories.data.length === 0 ? (
          <div className="adm-empty-inline"><span>📂</span> No categories yet.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Name</th><th>Slug</th><th>Type</th><th>Parent</th><th>Status</th></tr></thead>
              <tbody>
                {categories.data.map((cat) => {
                  const parent = categories.data.find((c) => c.id === cat.parent_id);
                  return (
                    <tr key={cat.id}>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:".4rem" }}>
                          {cat.parent_id && <span style={{ color:"var(--muted)", fontSize:".7rem" }}>└─</span>}
                          <span className="adm-table-name">{cat.name}</span>
                        </div>
                      </td>
                      <td><span className="adm-mono">{cat.slug}</span></td>
                      <td><span className={`adm-badge ${cat.parent_id ? "neutral" : "accent"}`}>{cat.parent_id ? "Sub" : "Root"}</span></td>
                      <td className="adm-muted">{parent?.name || "—"}</td>
                      <td><span className={`adm-badge ${cat.is_active !== false ? "success" : "neutral"}`}>{cat.is_active !== false ? "Active" : "Inactive"}</span></td>
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
