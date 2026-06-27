export function AdminField({ label, name, type="text", placeholder, value, onChange, error, hint, required }) {
  return (
    <div className="adm-field">
      <label className="adm-label">{label}{required&&<span className="adm-required"> *</span>}</label>
      <input className={`adm-input ${error?"error":""}`} type={type} placeholder={placeholder} value={value}
        onChange={(e)=>onChange(name,e.target.value)} required={required} />
      {hint&&<span className="adm-hint">{hint}</span>}
      {error&&<span className="adm-field-error">⚠ {error}</span>}
    </div>
  );
}
export function AdminTextarea({ label, name, placeholder, value, onChange, rows=3, hint }) {
  return (
    <div className="adm-field">
      <label className="adm-label">{label}</label>
      <textarea className="adm-input adm-textarea" placeholder={placeholder} value={value}
        onChange={(e)=>onChange(name,e.target.value)} rows={rows} />
      {hint&&<span className="adm-hint">{hint}</span>}
    </div>
  );
}
export function AdminSelect({ label, name, value, onChange, options, placeholder, required, error }) {
  return (
    <div className="adm-field">
      <label className="adm-label">{label}{required&&<span className="adm-required"> *</span>}</label>
      <select className="adm-input adm-select" value={value} onChange={(e)=>onChange(name,e.target.value)}>
        {placeholder&&<option value="">{placeholder}</option>}
        {options.map((o)=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error&&<span className="adm-field-error">⚠ {error}</span>}
    </div>
  );
}
export function AdminToggle({ label, name, value, onChange, hint }) {
  return (
    <div className="adm-field adm-field-row">
      <div><label className="adm-label">{label}</label>{hint&&<div className="adm-hint">{hint}</div>}</div>
      <button type="button" className={`adm-toggle ${value?"on":"off"}`} onClick={()=>onChange(name,!value)}>
        <span className="adm-toggle-knob" />
      </button>
    </div>
  );
}
export function ApiError({ message, onDismiss }) {
  if (!message) return null;
  return <div className="adm-api-error"><span>✕ {message}</span>{onDismiss&&<button className="adm-api-error-close" onClick={onDismiss}>✕</button>}</div>;
}
export function ApiSuccess({ message }) {
  if (!message) return null;
  return <div className="adm-api-success">✓ {message}</div>;
}
export function AdminCard({ title, subtitle, children, action }) {
  return (
    <div className="adm-card">
      {(title||action)&&(
        <div className="adm-card-header">
          <div>{title&&<div className="adm-card-title">{title}</div>}{subtitle&&<div className="adm-card-sub">{subtitle}</div>}</div>
          {action}
        </div>
      )}
      <div className="adm-card-body">{children}</div>
    </div>
  );
}
export function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="adm-stat-card">
      <div className="adm-stat-icon" style={{ color: color||"var(--accent)" }}>{icon}</div>
      <div className="adm-stat-value">{value}</div>
      <div className="adm-stat-label">{label}</div>
      {sub&&<div className="adm-stat-sub">{sub}</div>}
    </div>
  );
}
export function toSlug(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");
}
