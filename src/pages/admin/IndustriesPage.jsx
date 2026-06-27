/**
 * ADMIN — INDUSTRIES PAGE
 * Uses:
 *   GET  /api/industry          → list all industries
 *   POST /api/industry          → create industry  { name, slug, description }
 *   POST /api/assign            → assign product to industry  { productId, industryId }
 */
import { useState, useEffect } from "react";
import { useStore } from "../../store/StoreContext";
import { AdminCard, AdminField, AdminTextarea, ApiError, ApiSuccess, toSlug } from "../../components/admin/AdminFields";

function AddIndustryForm() {
  const { actions } = useStore();
  const EMPTY = { name: "", slug: "", description: "" };
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState(null);
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
    return !Object.keys(e).length;
  };

  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.createIndustry({ name: form.name.trim(), slug: form.slug.trim(), description: form.description.trim() });
    setLoading(false);
    if (res.ok) { setSuccess(`Industry "${res.data.name}" created!`); setForm(EMPTY); }
    else setApiErr(res.error);
  };

  return (
    <div className="adm-form-stack">
      <ApiError message={apiErr} onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />
      <div className="adm-form-row">
        <AdminField label="Industry Name" name="name" placeholder="e.g. Fire / EMS" value={form.name} onChange={set} error={errors.name} required />
        <AdminField label="Slug"          name="slug" placeholder="e.g. fire-ems"    value={form.slug} onChange={set} error={errors.slug} hint="Auto-generated" required />
      </div>
      <AdminTextarea label="Description" name="description" placeholder="Industry description…" value={form.description} onChange={set} rows={2} />
      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "+ Create Industry"}
      </button>
    </div>
  );
}

function AssignForm({ industries, products }) {
  const { actions } = useStore();
  const [form, setForm]     = useState({ productId: "", industryId: "" });
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState(null);
  const [success, setSuccess] = useState(null);

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const submit = async () => {
    if (!form.productId || !form.industryId) { setApiErr("Select both a product and an industry."); return; }
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.assignIndustry(form.productId, form.industryId);
    setLoading(false);
    if (res.ok) { setSuccess("Product assigned to industry!"); setForm({ productId: "", industryId: "" }); }
    else setApiErr(res.error);
  };

  return (
    <div className="adm-form-stack">
      <ApiError message={apiErr} onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />
      <div className="adm-form-row">
        <div className="adm-field">
          <label className="adm-label">Product <span className="adm-required">*</span></label>
          <select className="adm-input adm-select" value={form.productId} onChange={(e) => set("productId", e.target.value)}>
            <option value="">— Select product —</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="adm-field">
          <label className="adm-label">Industry <span className="adm-required">*</span></label>
          <select className="adm-input adm-select" value={form.industryId} onChange={(e) => set("industryId", e.target.value)}>
            <option value="">— Select industry —</option>
            {industries.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
      </div>
      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "ASSIGN →"}
      </button>
    </div>
  );
}

export default function IndustriesPage() {
  const { state, actions } = useStore();
  const { industries, products } = state;

  useEffect(() => {
    if (!industries.data.length && !industries.loading) actions.fetchIndustries();
    if (!products.data.length   && !products.loading)   actions.fetchProducts();
  }, []);

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">Industries</div>
          <div className="adm-page-sub">
            Manage /api/industry · Assign products via /api/assign
          </div>
        </div>
        <button className="adm-btn-outline" onClick={actions.fetchIndustries}>↻ Refresh</button>
      </div>

      {industries.error && (
        <div className="adm-api-error" style={{ marginBottom: "1.5rem" }}>
          ✕ {industries.error}
          <button className="adm-api-error-close" onClick={actions.fetchIndustries}>Retry</button>
        </div>
      )}

      <div className="adm-two-col">
        <AdminCard title="Create Industry" subtitle="POST /api/industry">
          <AddIndustryForm />
        </AdminCard>

        <AdminCard title="Assign Product to Industry" subtitle="POST /api/assign  · { productId, industryId }">
          {industries.data.length === 0 ? (
            <div className="adm-empty-inline"><span>⚠</span> Create an industry first</div>
          ) : (
            <AssignForm industries={industries.data} products={products.data} />
          )}
        </AdminCard>
      </div>

      {/* Industries list */}
      <AdminCard title={`All Industries (${industries.data.length})`} subtitle="GET /api/industry → { success, data: Industry[] }">
        {industries.loading ? (
          <div className="adm-skeleton-list">{[1,2,3,4].map((i) => <div key={i} className="adm-skeleton" style={{height:44,borderRadius:4}} />)}</div>
        ) : industries.data.length === 0 ? (
          <div className="adm-empty-inline"><span>⬡</span> No industries yet. Create one above.</div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th>Status</th></tr></thead>
              <tbody>
                {industries.data.map((ind) => (
                  <tr key={ind.id}>
                    <td><div className="adm-table-name">{ind.name}</div></td>
                    <td><span className="adm-mono">{ind.slug}</span></td>
                    <td style={{ maxWidth: 260 }}><div style={{ fontSize:".7rem", color:"var(--muted)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{ind.description || "—"}</div></td>
                    <td><span className={`adm-badge ${ind.isActive !== false ? "success" : "neutral"}`}>{ind.isActive !== false ? "Active" : "Inactive"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
