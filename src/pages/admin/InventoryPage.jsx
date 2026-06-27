/**
 * ADMIN — INVENTORY & WAREHOUSES PAGE
 * Uses:
 *   GET  /api/warehouses                    → Warehouse[]
 *   POST /api/warehouses                    → create warehouse
 *   POST /api/inventory/update              → set stock balance
 *   POST /api/inventory/reserve             → reserve stock
 *   POST /api/inventory/ship                → ship reserved stock
 *   GET  /api/inventory/variant/:variantId  → view stock for a variant
 */
import { useState, useEffect } from "react";
import { useStore } from "../../store/StoreContext";
import { AdminCard, AdminField, AdminSelect, ApiError, ApiSuccess } from "../../components/admin/AdminFields";
import { getVariantStock } from "../../services/productService";

function WarehouseForm() {
  const { actions } = useStore();
  const [form, setForm] = useState({ name: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const submit = async () => {
    if (!form.name.trim()) { setApiErr("Warehouse name is required"); return; }
    setApiErr(null); setSuccess(null); setLoading(true);
    const res = await actions.createWarehouse({ name: form.name.trim(), location: form.location.trim() });
    setLoading(false);
    if (res.ok) { setSuccess(`Warehouse "${res.data.name}" created!`); setForm({ name: "", location: "" }); actions.fetchWarehouses(); }
    else setApiErr(res.error);
  };

  return (
    <div className="adm-form-stack">
      <ApiError message={apiErr} onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />
      <AdminField label="Warehouse Name" name="name" placeholder="e.g. California HQ" value={form.name} onChange={set} required />
      <AdminField label="Location"       name="location" placeholder="e.g. Los Angeles, CA" value={form.location} onChange={set} />
      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : "+ Create Warehouse"}
      </button>
    </div>
  );
}

function StockForm({ products, warehouses }) {
  const { actions } = useStore();
  const [form, setForm]     = useState({ variantId: "", warehouseId: "", qtyAvailable: "", qtyReserved: "" });
  const [mode, setMode]     = useState("update"); // update | reserve | ship
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState(null);
  const [success, setSuccess] = useState(null);

  // Flatten all variants from all products
  const allVariants = products.flatMap((p) =>
    (p.ProductVariants || []).map((v) => ({ ...v, productName: p.name }))
  );

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const submit = async () => {
    if (!form.variantId || !form.warehouseId) { setApiErr("Select a variant and warehouse"); return; }
    setApiErr(null); setSuccess(null); setLoading(true);
    let res;
    if (mode === "update") {
      res = await actions.updateStock({
        variant_id:    form.variantId,
        warehouse_id:  form.warehouseId,
        qty_available: parseInt(form.qtyAvailable) || 0,
        qty_reserved:  parseInt(form.qtyReserved)  || 0,
      });
    } else if (mode === "reserve") {
      res = await actions.reserveStock({ variant_id: form.variantId, warehouse_id: form.warehouseId, quantity: parseInt(form.qtyAvailable) || 0 });
    } else {
      res = await actions.shipStock({ variant_id: form.variantId, warehouse_id: form.warehouseId, quantity: parseInt(form.qtyAvailable) || 0 });
    }
    setLoading(false);
    if (res.ok) { setSuccess("Stock operation successful!"); }
    else setApiErr(res.error);
  };

  return (
    <div className="adm-form-stack">
      <ApiError message={apiErr} onDismiss={() => setApiErr(null)} />
      <ApiSuccess message={success} />

      {/* Mode tabs */}
      <div style={{ display:"flex", gap:".4rem", marginBottom:".25rem" }}>
        {["update","reserve","ship"].map((m) => (
          <button key={m} onClick={() => setMode(m)}
            style={{ fontFamily:"var(--fontDisplay)", fontSize:".58rem", letterSpacing:".1em", textTransform:"uppercase", padding:"4px 12px", background: mode===m ? "var(--accent)" : "var(--surface)", color: mode===m ? "#fff" : "var(--muted)", border:"1px solid var(--border)", cursor:"pointer" }}>
            {m}
          </button>
        ))}
      </div>

      <div className="adm-form-row">
        <div className="adm-field">
          <label className="adm-label">Variant <span className="adm-required">*</span></label>
          <select className="adm-input adm-select" value={form.variantId} onChange={(e) => set("variantId", e.target.value)}>
            <option value="">— Select variant —</option>
            {allVariants.map((v) => (
              <option key={v.id} value={v.id}>{v.productName} — {v.variant_name || v.color || v.sku}</option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label className="adm-label">Warehouse <span className="adm-required">*</span></label>
          <select className="adm-input adm-select" value={form.warehouseId} onChange={(e) => set("warehouseId", e.target.value)}>
            <option value="">— Select warehouse —</option>
            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>
      </div>

      {mode === "update" ? (
        <div className="adm-form-row">
          <AdminField label="Qty Available" name="qtyAvailable" type="number" placeholder="0" value={form.qtyAvailable} onChange={set} />
          <AdminField label="Qty Reserved"  name="qtyReserved"  type="number" placeholder="0" value={form.qtyReserved}  onChange={set} />
        </div>
      ) : (
        <AdminField label={mode === "reserve" ? "Quantity to Reserve" : "Quantity to Ship"} name="qtyAvailable" type="number" placeholder="0" value={form.qtyAvailable} onChange={set} />
      )}

      <button className="adm-btn-primary" onClick={submit} disabled={loading}>
        {loading ? <span className="fs-spin">↻</span> : `${mode.toUpperCase()} STOCK →`}
      </button>
    </div>
  );
}

function VariantStockLookup({ products }) {
  const [variantId, setVariantId] = useState("");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const allVariants = products.flatMap((p) =>
    (p.ProductVariants || []).map((v) => ({ ...v, productName: p.name }))
  );

  const lookup = async () => {
    if (!variantId) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await getVariantStock(variantId);
      setResult(Array.isArray(res) ? res : [res]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-form-stack">
      {error && <div className="adm-api-error">✕ {error}</div>}
      <div style={{ display:"flex", gap:".75rem", alignItems:"flex-end" }}>
        <div className="adm-field" style={{ flex:1 }}>
          <label className="adm-label">Variant</label>
          <select className="adm-input adm-select" value={variantId} onChange={(e) => setVariantId(e.target.value)}>
            <option value="">— Select variant —</option>
            {allVariants.map((v) => (
              <option key={v.id} value={v.id}>{v.productName} — {v.variant_name || v.sku}</option>
            ))}
          </select>
        </div>
        <button className="adm-btn-primary" onClick={lookup} disabled={loading || !variantId}>
          {loading ? <span className="fs-spin">↻</span> : "LOOK UP"}
        </button>
      </div>
      {result && (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Warehouse</th><th>Available</th><th>Reserved</th><th>Updated</th></tr></thead>
            <tbody>
              {result.length === 0
                ? <tr><td colSpan={4} style={{ color:"var(--muted)", textAlign:"center" }}>No stock records found</td></tr>
                : result.map((s, i) => (
                  <tr key={i}>
                    <td>{s.Warehouse?.name || s.warehouse_id}</td>
                    <td><span style={{ color:"var(--success)", fontFamily:"var(--fontMono)" }}>{s.qty_available}</span></td>
                    <td><span style={{ color:"var(--warning)", fontFamily:"var(--fontMono)" }}>{s.qty_reserved}</span></td>
                    <td style={{ fontSize:".62rem", color:"var(--muted)" }}>{s.updated_at ? new Date(s.updated_at).toLocaleString() : "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function InventoryPage() {
  const { state, actions } = useStore();
  const { warehouses, products } = state;

  useEffect(() => {
    actions.fetchWarehouses();
    if (!products.data.length && !products.loading) actions.fetchProducts();
  }, []);

  return (
    <div className="adm-page">
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">Inventory & Warehouses</div>
          <div className="adm-page-sub">Manage stock levels · /api/inventory · /api/warehouses</div>
        </div>
        <button className="adm-btn-outline" onClick={actions.fetchWarehouses}>↻ Refresh</button>
      </div>

      <div className="adm-two-col">
        <AdminCard title="Create Warehouse" subtitle="POST /api/warehouses  · { name, location }">
          <WarehouseForm />
        </AdminCard>

        <AdminCard title="Warehouses" subtitle="GET /api/warehouses">
          {warehouses.data.length === 0 ? (
            <div className="adm-empty-inline"><span>🏭</span> No warehouses yet. Create one first.</div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>Name</th><th>Location</th><th>ID</th></tr></thead>
                <tbody>
                  {warehouses.data.map((w) => (
                    <tr key={w.id}>
                      <td className="adm-table-name">{w.name}</td>
                      <td style={{ color:"var(--muted)", fontSize:".72rem" }}>{w.location || "—"}</td>
                      <td><span className="adm-mono" style={{ fontSize:".6rem" }}>{w.id?.slice(0,8)}…</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>

      <AdminCard title="Update / Reserve / Ship Stock" subtitle="POST /api/inventory/update · /api/inventory/reserve · /api/inventory/ship">
        {warehouses.data.length === 0 ? (
          <div className="adm-empty-inline"><span>⚠</span> Create a warehouse first</div>
        ) : (
          <StockForm products={products.data} warehouses={warehouses.data} />
        )}
      </AdminCard>

      <AdminCard title="View Stock by Variant" subtitle="GET /api/inventory/variant/:variantId">
        {products.data.length === 0 ? (
          <div className="adm-empty-inline"><span>⚠</span> Add products first to view stock</div>
        ) : (
          <VariantStockLookup products={products.data} />
        )}
      </AdminCard>
    </div>
  );
}
