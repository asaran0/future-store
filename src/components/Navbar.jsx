import { useState, useRef, useEffect } from "react";
import { useStore } from "../store/StoreContext";
import { NAV } from "../data/foxfury";

const THEME_DOTS = { black:"#1a1a2e", dark:"#4f46e5", cyber:"#00ffc8", light:"#ccccdd" };

function DropdownMenu({ items, onNavigate }) {
  return (
    <div className="ff-dropdown">
      {items.map((item) => (
        <button key={item.id} className="ff-dropdown-item"
          onClick={() => onNavigate("shop", item.id)}>
          <span className="ff-dropdown-icon">{item.icon}</span>
          <div>
            <div className="ff-dropdown-label">{item.label}</div>
            <div className="ff-dropdown-desc">{item.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function NavItem({ item, activePage, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  if (!item.dropdown) {
    return (
      <button className={`ff-nav-link ${activePage === item.link ? "active" : ""}`}
        onClick={() => onNavigate(item.link)}>{item.label}</button>
    );
  }
  return (
    <div className="ff-nav-item-wrap" ref={ref}>
      <button className={`ff-nav-link ${open ? "open" : ""}`}
        onMouseEnter={() => setOpen(true)} onClick={() => setOpen(v => !v)}>
        {item.label} <span className="ff-nav-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div onMouseLeave={() => setOpen(false)}>
          <DropdownMenu items={item.dropdown}
            onNavigate={(pg, f) => { onNavigate(pg, f); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}

export default function Navbar({ page, setPage }) {
  const { state, dispatch, actions } = useStore();
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const isAdmin   = page.startsWith("admin");

  const handleNav = (targetPage, filter) => {
    if (filter) { dispatch({ type: "SET_FILTER", payload: { industryId: filter } }); setPage("shop"); }
    else setPage(targetPage);
  };

  return (
    <>
      {/* Slim announcement bar */}
      <div className="ff-ann-bar">
        🚚&nbsp;<strong>Free Shipping On Orders Over $99</strong>
        &nbsp;·&nbsp;In-Stock Orders Ship Within 24 Hours
        <span className="ff-ann-link" onClick={() => setPage("shop")}>&nbsp;Shop Now →</span>
      </div>

      {/* Transparent nav — exactly like the reference image */}
      <nav className="ff-nav">
        {/* Logo: thin, spaced — like "N.JEY" in the image */}
        <div className="ff-logo" onClick={() => setPage("home")}>
          <span className="ff-logo-fox">FOX</span><span className="ff-logo-fury">FURY</span>
        </div>

        {/* Centre nav links */}
        {!isAdmin ? (
          <div className="ff-nav-links">
            {NAV.map((item) => (
              <NavItem key={item.id} item={item} activePage={page} onNavigate={handleNav} />
            ))}
          </div>
        ) : (
          <div className="ff-nav-links">
            <button className="ff-nav-link" onClick={() => setPage("home")}>← Store</button>
            <span style={{ color:"var(--muted)", fontSize:".55rem" }}>|</span>
            <span className="ff-nav-link active">Admin Panel</span>
          </div>
        )}

        {/* Right actions */}
        <div className="ff-nav-actions">
          <div className="ff-theme-selector">
            {Object.entries(THEME_DOTS).map(([t, c]) => (
              <div key={t} className={`ff-theme-dot ${state.theme === t ? "active" : ""}`}
                style={{ background: c }} onClick={() => dispatch({ type:"SET_THEME", payload:t })} title={t} />
            ))}
          </div>

          {state.user && (
            <button className={`ff-icon-btn ${isAdmin ? "active" : ""}`}
              onClick={() => setPage(isAdmin ? "home" : "admin")} title="Admin">⚙</button>
          )}

          {!isAdmin && (
            <>
              <button className="ff-icon-btn" onClick={() => setPage("wishlist")} title="Wishlist">
                ♡{state.wishlist.length > 0 && <span className="ff-nav-badge">{state.wishlist.length}</span>}
              </button>
              <button className="ff-icon-btn" onClick={() => dispatch({ type:"TOGGLE_CART" })} title="Cart">
                🛒{cartCount > 0 && <span className="ff-nav-badge">{cartCount}</span>}
              </button>
            </>
          )}

          {state.user ? (
            <div className="ff-user-chip" onClick={actions.logout} title="Sign out">
              <span>👤</span>
              <span>{state.user.first_name || state.user.email}</span>
              <span style={{ opacity:.3, fontSize:".5rem" }}>✕</span>
            </div>
          ) : (
            <>
              <button className="ff-btn-ghost-nav"
                onClick={() => dispatch({ type:"OPEN_AUTH_MODAL", payload:"login" })}>SIGN IN</button>
              <button className="ff-btn-outline-nav"
                onClick={() => dispatch({ type:"OPEN_AUTH_MODAL", payload:"register" })}>REGISTER</button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
