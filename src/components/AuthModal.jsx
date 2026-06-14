import { useState, useEffect } from "react";
import { useStore } from "../store/StoreContext";

// ── Validation helpers ───────────────────────────────────────
const validators = {
  email:     (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email",
  password:  (v) => v.length >= 8 ? null : "Password must be at least 8 characters",
  firstName: (v) => v.trim().length >= 2 ? null : "First name is required",
  lastName:  (v) => v.trim().length >= 2 ? null : "Last name is required",
};

function useForm(initial) {
  const [values,  setValues]  = useState(initial);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  const set = (field, val) => {
    setValues((v) => ({ ...v, [field]: val }));
    if (touched[field]) {
      const err = validators[field]?.(val);
      setErrors((e) => ({ ...e, [field]: err || null }));
    }
  };

  const blur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const err = validators[field]?.(values[field] ?? "");
    setErrors((e) => ({ ...e, [field]: err || null }));
  };

  const validate = (fields) => {
    const errs = {};
    fields.forEach((f) => {
      const err = validators[f]?.(values[f] ?? "");
      if (err) errs[f] = err;
    });
    setErrors(errs);
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    return Object.keys(errs).length === 0;
  };

  const reset = () => { setValues(initial); setErrors({}); setTouched({}); };

  return { values, errors, set, blur, validate, reset };
}

// ── Input field ──────────────────────────────────────────────
function Field({ label, name, type = "text", placeholder, form, autoComplete }) {
  return (
    <div className="fs-field">
      <label className="fs-label">{label}</label>
      <input
        className={`fs-input ${form.errors[name] ? "error" : ""}`}
        type={type}
        placeholder={placeholder}
        value={form.values[name] || ""}
        onChange={(e) => form.set(name, e.target.value)}
        onBlur={() => form.blur(name)}
        autoComplete={autoComplete}
      />
      {form.errors[name] && (
        <span className="fs-input-error">⚠ {form.errors[name]}</span>
      )}
    </div>
  );
}

// ── Login form ───────────────────────────────────────────────
function LoginForm({ onSwitch, onClose }) {
  const { actions } = useStore();
  const form = useForm({ email: "", password: "" });
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async () => {
    setApiError(null);
    if (!form.validate(["email", "password"])) return;
    setLoading(true);
    const res = await actions.login({ email: form.values.email, password: form.values.password });
    setLoading(false);
    if (res.ok) { onClose(); }
    else { setApiError(res.error); }
  };

  return (
    <>
      <div className="fs-modal-body">
        {apiError && (
          <div className="fs-form-error">
            <span>✕</span> {apiError}
          </div>
        )}
        <Field label="Email Address" name="email" type="email" placeholder="you@future.com" form={form} autoComplete="email" />
        <Field label="Password" name="password" type="password" placeholder="••••••••" form={form} autoComplete="current-password" />

        <button
          className="fs-btn-primary"
          style={{ width: "100%", marginTop: ".25rem" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="fs-spin">↻</span> : "SIGN IN →"}
        </button>
      </div>
      <div className="fs-modal-footer">
        <span className="fs-modal-footer-text">
          Don't have an account?{" "}
          <span className="fs-modal-footer-link" onClick={onSwitch}>Create one</span>
        </span>
      </div>
    </>
  );
}

// ── Register form ────────────────────────────────────────────
function RegisterForm({ onSwitch, onClose }) {
  const { actions } = useStore();
  const form = useForm({ email: "", password: "", firstName: "", lastName: "", userType: "retail" });
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async () => {
    setApiError(null);
    if (!form.validate(["email", "password", "firstName", "lastName"])) return;
    setLoading(true);
    const res = await actions.register(form.values);
    setLoading(false);
    if (res.ok) { onClose(); }
    else { setApiError(res.error); }
  };

  return (
    <>
      <div className="fs-modal-body">
        {apiError && (
          <div className="fs-form-error">
            <span>✕</span> {apiError}
          </div>
        )}
        <div className="fs-field-row">
          <Field label="First Name" name="firstName" placeholder="John" form={form} autoComplete="given-name" />
          <Field label="Last Name"  name="lastName"  placeholder="Doe"  form={form} autoComplete="family-name" />
        </div>
        <Field label="Email Address" name="email" type="email" placeholder="you@future.com" form={form} autoComplete="email" />
        <Field label="Password"      name="password" type="password" placeholder="Min. 8 characters" form={form} autoComplete="new-password" />

        <div className="fs-field">
          <label className="fs-label">Account Type</label>
          <select
            className="fs-select"
            value={form.values.userType}
            onChange={(e) => form.set("userType", e.target.value)}
          >
            <option value="retail">Retail Customer</option>
            <option value="wholesale">Wholesale</option>
            <option value="business">Business</option>
          </select>
        </div>

        <button
          className="fs-btn-primary"
          style={{ width: "100%", marginTop: ".25rem" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="fs-spin">↻</span> : "CREATE ACCOUNT →"}
        </button>

        <p style={{ fontSize: ".65rem", color: "var(--muted)", textAlign: "center", lineHeight: 1.5 }}>
          By registering you agree to our{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer" }}>Terms of Service</span>
          {" "}and{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer" }}>Privacy Policy</span>
        </p>
      </div>
      <div className="fs-modal-footer">
        <span className="fs-modal-footer-text">
          Already have an account?{" "}
          <span className="fs-modal-footer-link" onClick={onSwitch}>Sign in</span>
        </span>
      </div>
    </>
  );
}

// ── Main Modal ───────────────────────────────────────────────
export default function AuthModal() {
  const { state, dispatch } = useStore();
  const { authModal } = state.ui;
  const [tab, setTab] = useState("login");

  // Sync tab with how the modal was opened
  useEffect(() => {
    if (authModal) setTab(authModal);
  }, [authModal]);

  if (!authModal) return null;

  const close = () => dispatch({ type: "CLOSE_AUTH_MODAL" });

  // Close on Escape
  const handleKey = (e) => { if (e.key === "Escape") close(); };

  return (
    <div className="fs-modal-overlay" onClick={close} onKeyDown={handleKey} tabIndex={-1}>
      <div className="fs-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="fs-modal-header">
          <div>
            <div className="fs-modal-icon">{tab === "login" ? "⚡" : "🚀"}</div>
            <div className="fs-modal-title">
              {tab === "login" ? "Welcome Back" : "Join N.JEY"}
            </div>
            <div className="fs-modal-sub">
              {tab === "login"
                ? "Sign in to your account to continue"
                : "Create your account and step into the future"}
            </div>
          </div>
          <button className="fs-modal-close" onClick={close}>✕</button>
        </div>

        {/* Tabs */}
        <div className="fs-modal-tabs">
          <button className={`fs-modal-tab ${tab === "login"    ? "active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`fs-modal-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Register</button>
        </div>

        {/* Body */}
        {tab === "login"
          ? <LoginForm    onSwitch={() => setTab("register")} onClose={close} />
          : <RegisterForm onSwitch={() => setTab("login")}    onClose={close} />
        }
      </div>
    </div>
  );
}
