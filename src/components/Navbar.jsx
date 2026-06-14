import { useStore } from "../store/StoreContext";

const THEME_COLORS = { dark: "#4f46e5", cyber: "#00ffc8", light: "#c7c7ff" };

export default function Navbar({ page, setPage }) {
  const { state, dispatch, actions } = useStore();
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const isAdmin   = page.startsWith("admin");

  return (
    <nav className="fs-nav">
      <div className="fs-logo" onClick={() => setPage("home")}>
        <div className="fs-logo-dot" />
        N.JEY STORE
      </div>

      {/* Store nav links — hidden in admin */}
      {!isAdmin && (
        <div className="fs-nav-links">
          {["home", "shop", "wishlist", "orders"].map((p) => (
            <span key={p} className={`fs-nav-link ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
              {p}
            </span>
          ))}
        </div>
      )}

      {/* Admin breadcrumb */}
      {isAdmin && (
        <div className="fs-nav-links">
          <span className="fs-nav-link" onClick={() => setPage("home")}>← Store</span>
          <span style={{ color: "var(--muted)", fontSize: ".6rem" }}>|</span>
          <span className="fs-nav-link active">Admin Panel</span>
        </div>
      )}

      <div className="fs-nav-actions">
        {/* Theme switcher */}
        <div className="fs-theme-selector">
          {Object.entries(THEME_COLORS).map(([t, c]) => (
            <div
              key={t}
              className={`fs-theme-dot ${state.theme === t ? "active" : ""}`}
              style={{ background: c }}
              onClick={() => dispatch({ type: "SET_THEME", payload: t })}
              title={`${t} theme`}
            />
          ))}
        </div>

        {/* Admin button — show when logged in */}
        {state.user && (
          <button
            className={`fs-icon-btn ${isAdmin ? "active" : ""}`}
            style={isAdmin ? { borderColor: "var(--accent)", background: "var(--surface)" } : {}}
            onClick={() => setPage(isAdmin ? "home" : "admin")}
            title="Admin Panel"
          >
            ⚙
          </button>
        )}

        {/* Wishlist + Cart — only in store view */}
        {!isAdmin && (
          <>
            <button className="fs-icon-btn" onClick={() => setPage("wishlist")} title="Wishlist">
              ♡
              {state.wishlist.length > 0 && <span className="fs-nav-badge">{state.wishlist.length}</span>}
            </button>
            <button className="fs-icon-btn" onClick={() => dispatch({ type: "TOGGLE_CART" })} title="Cart">
              🛒
              {cartCount > 0 && <span className="fs-nav-badge">{cartCount}</span>}
            </button>
          </>
        )}

        {/* Auth */}
        {state.user ? (
          <div className="fs-user-chip" onClick={actions.logout} title="Click to sign out">
            <span>👤</span>
            <span>{state.user.first_name || state.user.email}</span>
            <span style={{ opacity: 0.4, fontSize: ".55rem" }}>✕</span>
          </div>
        ) : (
          <>
            <button
              className="fs-btn-outline"
              style={{ height: 36, fontSize: ".6rem", padding: "0 1rem" }}
              onClick={() => dispatch({ type: "OPEN_AUTH_MODAL", payload: "login" })}
            >
              SIGN IN
            </button>
            <button
              className="fs-btn-primary"
              style={{ height: 36, fontSize: ".6rem", padding: "0 1rem" }}
              onClick={() => dispatch({ type: "OPEN_AUTH_MODAL", payload: "register" })}
            >
              REGISTER
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
