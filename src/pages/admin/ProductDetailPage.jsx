import { useState } from "react";
import { useStore } from "../../store/StoreContext";
import { AdminCard, AdminField, AdminSelect, AdminToggle, ApiError, ApiSuccess } from "../../components/admin/AdminFields";

function AddVariantForm({ productId }) {
  const { actions } = useStore();
  const EMPTY = { sku:"", variant_name:"", color:"", msrp:"", cost:"" };
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState(null);
  const [success, setSuccess] = useState(null);

  const set = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErrors((e) => ({ ...e, [f]: null })); };
  const validate = () => {
    const e = {};
    if (!form.sku.trim())          e.sku          = "SKU required";
    if (!form.variant_name.trim()) e.variant_name = "Variant name required";
    if (!form.msrp || isNaN(parseFloat(form.msrp))) e.msrp = "Valid price required";
    setErrors(e); return !Object.keys(e).length;
  };
  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.addVariant(productId, { sku: form.sku.trim(), variant_name: form.variant_name.trim(), color: form.color.trim() || undefined, msrp: parseFloat(form.msrp), cost: form.cost ? parseFloat(form.cost) : undefined });
    setLoading(false);
    if (res.ok) { setSuccess(`Variant "${res.data.variant_name}" added!`); setForm(EMPTY); }
    else setApiErr(res.error);
  };

  return (
    <div className="adm-form-stack">
      <ApiError message={apiErr} onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />
      <div className="adm-form-row">
        <AdminField label="Variant SKU" name="sku" placeholder="e.g. FF-NMD-BLK" value={form.sku} onChange={set} error={errors.sku} required />
        <AdminField label="Color / Style" name="color" placeholder="e.g. Matte Black" value={form.color} onChange={set} />
      </div>
      <AdminField label="Variant Name" name="variant_name" placeholder="e.g. Nomad 360 – Matte Black" value={form.variant_name} onChange={set} error={errors.variant_name} required />
      <div className="adm-form-row">
        <AdminField label="MSRP (Retail $)" name="msrp" type="number" placeholder="999.99" value={form.msrp} onChange={set} error={errors.msrp} required hint="Customer price" />
        <AdminField label="Cost $"          name="cost" type="number" placeholder="450.00" value={form.cost} onChange={set} hint="Optional" />
      </div>
      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "+ Add Variant"}
      </button>
    </div>
  );
}

function AddMediaForm({ productId, existingMedia }) {
  const { actions } = useStore();
  const EMPTY = { url:"", media_type:"image", is_primary: !existingMedia?.length };
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState(null);
  const [success, setSuccess] = useState(null);

  const set = (f, v) => { setForm((p) => ({ ...p, [f]: v })); setErrors((e) => ({ ...e, [f]: null })); };
  const validate = () => {
    const e = {};
    if (!form.url.trim()) { e.url = "URL required"; }
    else { try { new URL(form.url); } catch { e.url = "Enter a valid https:// URL"; } }
    setErrors(e); return !Object.keys(e).length;
  };
  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.addMedia(productId, { url: form.url.trim(), media_type: form.media_type, is_primary: form.is_primary });
    setLoading(false);
    if (res.ok) { setSuccess("Media added!"); setForm({ ...EMPTY, is_primary: false }); }
    else setApiErr(res.error);
  };

  return (
    <div className="adm-form-stack">
      <ApiError message={apiErr} onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />
      <AdminField label="Image / Video URL" name="url" placeholder="https://example.com/image.jpg" value={form.url} onChange={set} error={errors.url} required hint="Direct link to image or video" />
      <div className="adm-form-row">
        <AdminSelect label="Media Type" name="media_type" value={form.media_type} onChange={set}
          options={[{ value:"image",label:"Image" },{ value:"video",label:"Video" },{ value:"360",label:"360° View" }]} />
        <AdminToggle label="Set as Primary" name="is_primary" value={form.is_primary} onChange={set} hint="Shown as main product image" />
      </div>
      {form.url && form.media_type === "image" && (() => { try { new URL(form.url); return (
        <div className="adm-img-preview">
          <img src={form.url} alt="Preview" onError={(e) => { e.target.style.display="none"; }} />
          <span className="adm-img-preview-lbl">Preview</span>
        </div>
      ); } catch { return null; } })()}
      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "+ Add Media"}
      </button>
    </div>
  );
}

export default function ProductDetailPage({ setAdminPage }) {
  const { state } = useStore();
  const product = state.products.data.find((p) => p.id === state.admin?.selectedProduct?.id) || state.admin?.selectedProduct;

  if (!product) {
    return (
      <div className="adm-page">
        <div className="adm-page-header"><div className="adm-page-title">Product Detail</div></div>
        <div className="adm-empty-inline" style={{ padding:"4rem", justifyContent:"center" }}>
          <span>📭</span> No product selected. <span className="adm-link" onClick={() => setAdminPage("products")}>Go to Products</span>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:".75rem", flexWrap:"wrap" }}>
            <button className="adm-btn-ghost" onClick={() => setAdminPage("products")}>← Back</button>
            <div className="adm-page-title">{product.name}</div>
            <span className={`adm-badge ${product.status==="active"?"success":"neutral"}`}>{product.status}</span>
          </div>
          <div className="adm-page-sub">SKU: <span className="adm-mono">{product.sku}</span> · Brand: {product.brand || "—"} · ID: <span className="adm-mono" style={{fontSize:".6rem"}}>{product.id}</span></div>
        </div>
      </div>

      {/* Product info */}
      <AdminCard title="Product Info">
        <div className="adm-info-grid">
          {[["Name",product.name],["SKU",product.sku],["Slug",product.slug],["Brand",product.brand||"—"],["Category ID",product.category_id],["Status",product.status],
            ["Created",product.created_at ? new Date(product.created_at).toLocaleDateString("en-US",{dateStyle:"medium"}) : "—"],
            ["Updated",product.updated_at ? new Date(product.updated_at).toLocaleDateString("en-US",{dateStyle:"medium"}) : "—"]
          ].map(([k,v]) => (
            <div key={k} className="adm-info-row">
              <span className="adm-info-key">{k}</span>
              <span className="adm-info-val adm-mono">{v}</span>
            </div>
          ))}
          {product.description && (
            <div className="adm-info-row" style={{ gridColumn:"1 / -1" }}>
              <span className="adm-info-key">Description</span>
              <span className="adm-info-val">{product.description}</span>
            </div>
          )}
        </div>
      </AdminCard>

      {/* Variants */}
      <div className="adm-two-col">
        <AdminCard title="Add Variant" subtitle={`POST /api/products/${product.id}/variants`}>
          <AddVariantForm productId={product.id} />
        </AdminCard>
        <AdminCard title={`Variants (${product.ProductVariants?.length || 0})`} subtitle="Current variants for this product">
          {!product.ProductVariants?.length ? (
            <div className="adm-empty-inline"><span>⬡</span> No variants yet.</div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>SKU</th><th>Name</th><th>Color</th><th>MSRP</th><th>Cost</th><th>Status</th></tr></thead>
                <tbody>
                  {product.ProductVariants.map((v) => (
                    <tr key={v.id}>
                      <td><span className="adm-mono">{v.sku}</span></td>
                      <td className="adm-table-name">{v.variant_name}</td>
                      <td>{v.color || <span className="adm-muted">—</span>}</td>
                      <td><span className="adm-price">${parseFloat(v.msrp).toFixed(2)}</span></td>
                      <td>{v.cost ? `$${parseFloat(v.cost).toFixed(2)}` : <span className="adm-muted">—</span>}</td>
                      <td><span className={`adm-badge ${v.is_active?"success":"neutral"}`}>{v.is_active?"Active":"Inactive"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>

      {/* Media */}
      <div className="adm-two-col">
        <AdminCard title="Add Media" subtitle={`POST /api/products/${product.id}/media`}>
          <AddMediaForm productId={product.id} existingMedia={product.ProductMedia} />
        </AdminCard>
        <AdminCard title={`Media (${product.ProductMedia?.length || 0})`} subtitle="Images and videos">
          {!product.ProductMedia?.length ? (
            <div className="adm-empty-inline"><span>🖼</span> No media yet.</div>
          ) : (
            <div className="adm-media-grid">
              {product.ProductMedia.map((m) => (
                <div key={m.id} className="adm-media-card">
                  <div className="adm-media-thumb">
                    <img src={m.url} alt="" onError={(e) => { e.target.src=""; e.target.parentNode.innerHTML='<span style="font-size:1.5rem">🖼</span>'; }} />
                  </div>
                  <div className="adm-media-info">
                    <div className="adm-media-url" title={m.url}>{m.url}</div>
                    <div style={{ display:"flex", gap:".35rem", marginTop:".3rem" }}>
                      <span className="adm-badge-neutral">{m.media_type}</span>
                      {m.is_primary && <span className="adm-badge success">Primary</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
