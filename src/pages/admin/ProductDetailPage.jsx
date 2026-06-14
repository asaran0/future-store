import { useState } from "react";
import { useStore } from "../../store/StoreContext";
import {
  AdminCard, AdminField, AdminSelect, AdminToggle,
  ApiError, ApiSuccess,
} from "../../components/admin/AdminFields";

// ── Add Variant form ─────────────────────────────────────────
function AddVariantForm({ productId }) {
  const { actions } = useStore();
  const EMPTY = { sku: "", variant_name: "", color: "", msrp: "", cost: "" };
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState(null);
  const [success, setSuccess] = useState(null);

  const set = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.sku.trim())          e.sku          = "SKU is required";
    if (!form.variant_name.trim()) e.variant_name = "Variant name is required";
    if (!form.msrp || isNaN(parseFloat(form.msrp))) e.msrp = "Valid MSRP price required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.addVariant(productId, {
      sku:          form.sku.trim(),
      variant_name: form.variant_name.trim(),
      color:        form.color.trim() || undefined,
      msrp:         parseFloat(form.msrp),
      cost:         form.cost ? parseFloat(form.cost) : undefined,
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(`Variant "${res.data.variant_name}" added (SKU: ${res.data.sku})`);
      setForm(EMPTY);
    } else {
      setApiErr(res.error);
    }
  };

  return (
    <div className="adm-form-stack">
      <ApiError   message={apiErr}  onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />

      <div className="adm-form-row">
        <AdminField label="Variant SKU"  name="sku"          placeholder="e.g. PHN-X100-BLK" value={form.sku}          onChange={set} error={errors.sku}          required />
        <AdminField label="Color / Style" name="color"        placeholder="e.g. Matte Black"  value={form.color}        onChange={set} />
      </div>
      <AdminField   label="Variant Name" name="variant_name"  placeholder="e.g. Quantum Phone X100 - Matte Black" value={form.variant_name} onChange={set} error={errors.variant_name} required />
      <div className="adm-form-row">
        <AdminField label="MSRP (Retail Price)" name="msrp" type="number" placeholder="999.99" value={form.msrp} onChange={set} error={errors.msrp} required hint="Customer-facing price" />
        <AdminField label="Cost Price"          name="cost" type="number" placeholder="450.00" value={form.cost} onChange={set} hint="Your cost (optional)" />
      </div>
      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "+ Add Variant"}
      </button>
    </div>
  );
}

// ── Add Media form ───────────────────────────────────────────
function AddMediaForm({ productId, existingMedia }) {
  const { actions } = useStore();
  const hasMedia = existingMedia?.length > 0;
  const EMPTY = { url: "", media_type: "image", is_primary: !hasMedia };
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState(null);
  const [success, setSuccess] = useState(null);

  const set = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.url.trim()) e.url = "URL is required";
    else {
      try { new URL(form.url); }
      catch { e.url = "Enter a valid URL (https://…)"; }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.addMedia(productId, {
      url:        form.url.trim(),
      media_type: form.media_type,
      is_primary: form.is_primary,
    });
    setLoading(false);
    if (res.ok) {
      setSuccess("Media added successfully!");
      setForm({ ...EMPTY, is_primary: false });
    } else {
      setApiErr(res.error);
    }
  };

  return (
    <div className="adm-form-stack">
      <ApiError   message={apiErr}  onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />

      <AdminField
        label="Media URL"
        name="url"
        placeholder="https://example.com/image.jpg"
        value={form.url}
        onChange={set}
        error={errors.url}
        required
        hint="Direct link to image or video"
      />
      <div className="adm-form-row">
        <AdminSelect
          label="Media Type"
          name="media_type"
          value={form.media_type}
          onChange={set}
          options={[
            { value: "image", label: "Image" },
            { value: "video", label: "Video" },
            { value: "360",   label: "360° View" },
          ]}
        />
        <AdminToggle
          label="Set as Primary"
          name="is_primary"
          value={form.is_primary}
          onChange={set}
          hint="Shown as the main product image"
        />
      </div>

      {/* URL preview */}
      {form.url && form.media_type === "image" && (() => {
        try { new URL(form.url); return (
          <div className="adm-img-preview">
            <img
              src={form.url}
              alt="Preview"
              onError={(e) => { e.target.style.display = "none"; }}
            />
            <span className="adm-img-preview-lbl">Preview</span>
          </div>
        ); } catch { return null; }
      })()}

      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "+ Add Media"}
      </button>
    </div>
  );
}

// ── Variants table ───────────────────────────────────────────
function VariantsTable({ variants }) {
  if (!variants?.length) {
    return (
      <div className="adm-empty-inline">
        <span>⬡</span> No variants yet. Add the first one above.
      </div>
    );
  }
  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead>
          <tr><th>SKU</th><th>Variant Name</th><th>Color</th><th>MSRP</th><th>Cost</th><th>Status</th></tr>
        </thead>
        <tbody>
          {variants.map((v) => (
            <tr key={v.id}>
              <td><span className="adm-mono">{v.sku}</span></td>
              <td className="adm-table-name">{v.variant_name}</td>
              <td>{v.color || <span className="adm-muted">—</span>}</td>
              <td><span className="adm-price">${parseFloat(v.msrp).toFixed(2)}</span></td>
              <td>{v.cost ? `$${parseFloat(v.cost).toFixed(2)}` : <span className="adm-muted">—</span>}</td>
              <td>
                <span className={`adm-badge ${v.is_active ? "success" : "neutral"}`}>
                  {v.is_active ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Media table ──────────────────────────────────────────────
function MediaTable({ media }) {
  if (!media?.length) {
    return (
      <div className="adm-empty-inline">
        <span>🖼</span> No media yet. Add an image URL above.
      </div>
    );
  }
  return (
    <div className="adm-media-grid">
      {media.map((m) => (
        <div key={m.id} className="adm-media-card">
          <div className="adm-media-thumb">
            <img
              src={m.url}
              alt="Product media"
              onError={(e) => { e.target.src = ""; e.target.parentNode.innerHTML = '<span style="font-size:2rem">🖼</span>'; }}
            />
          </div>
          <div className="adm-media-info">
            <div className="adm-media-url" title={m.url}>{m.url}</div>
            <div style={{ display: "flex", gap: ".4rem", marginTop: ".3rem" }}>
              <span className="adm-badge-neutral">{m.media_type}</span>
              {m.is_primary && <span className="adm-badge success">Primary</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function ProductDetailPage({ setAdminPage }) {
  const { state } = useStore();
  const product = state.admin?.selectedProduct;

  // Get the latest version of this product from the store (it may have new variants/media)
  const liveProduct = state.products.data.find((p) => p.id === product?.id) || product;

  if (!liveProduct) {
    return (
      <div className="adm-page">
        <div className="adm-page-header">
          <div className="adm-page-title">Product Detail</div>
        </div>
        <div className="adm-empty-inline" style={{ padding: "4rem", justifyContent: "center" }}>
          <span>📭</span> No product selected. <span className="adm-link" onClick={() => setAdminPage("products")}>Go to Products</span>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-page">
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
            <button className="adm-btn-ghost" onClick={() => setAdminPage("products")}>← Back</button>
            <div className="adm-page-title">{liveProduct.name}</div>
            <span className={`adm-badge ${liveProduct.status === "active" ? "success" : "neutral"}`}>
              {liveProduct.status}
            </span>
          </div>
          <div className="adm-page-sub">
            SKU: <span className="adm-mono">{liveProduct.sku}</span>
            &nbsp;·&nbsp; Brand: {liveProduct.brand || "—"}
            &nbsp;·&nbsp; ID: <span className="adm-mono" style={{ fontSize: ".62rem" }}>{liveProduct.id}</span>
          </div>
        </div>
      </div>

      {/* Product info card */}
      <AdminCard title="Product Info">
        <div className="adm-info-grid">
          {[
            ["Name",        liveProduct.name],
            ["SKU",         liveProduct.sku],
            ["Slug",        liveProduct.slug],
            ["Brand",       liveProduct.brand || "—"],
            ["Category ID", liveProduct.category_id],
            ["Status",      liveProduct.status],
            ["Created",     new Date(liveProduct.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })],
            ["Updated",     new Date(liveProduct.updated_at).toLocaleDateString("en-US", { dateStyle: "medium" })],
          ].map(([k, v]) => (
            <div key={k} className="adm-info-row">
              <span className="adm-info-key">{k}</span>
              <span className="adm-info-val adm-mono">{v}</span>
            </div>
          ))}
          {liveProduct.description && (
            <div className="adm-info-row" style={{ gridColumn: "1 / -1" }}>
              <span className="adm-info-key">Description</span>
              <span className="adm-info-val">{liveProduct.description}</span>
            </div>
          )}
        </div>
      </AdminCard>

      {/* Variants */}
      <div className="adm-two-col">
        <AdminCard
          title="Add Variant"
          subtitle="Add a color, size or style variant with its own SKU and price"
        >
          <AddVariantForm productId={liveProduct.id} />
        </AdminCard>

        <AdminCard
          title={`Variants (${liveProduct.ProductVariants?.length || 0})`}
          subtitle="All variants for this product"
        >
          <VariantsTable variants={liveProduct.ProductVariants} />
        </AdminCard>
      </div>

      {/* Media */}
      <div className="adm-two-col">
        <AdminCard
          title="Add Media"
          subtitle="Add an image or video URL for this product"
        >
          <AddMediaForm productId={liveProduct.id} existingMedia={liveProduct.ProductMedia} />
        </AdminCard>

        <AdminCard
          title={`Media (${liveProduct.ProductMedia?.length || 0})`}
          subtitle="Images and videos attached to this product"
        >
          <MediaTable media={liveProduct.ProductMedia} />
        </AdminCard>
      </div>
    </div>
  );
}
