import { useState, useRef, useEffect } from "react";
import { useStore } from "../store/StoreContext";
import { NAV } from "../data/foxfury";

const THEME_COLORS = {
  dark:     { bg: "#f5c518", label: "Dark" },
  foxfury:  { bg: "#d4a017", label: "FoxFury" },
  cyber:    { bg: "#00ffc8", label: "Cyber" },
  light:    { bg: "#dddddd", label: "Light" },
};

function DropdownMenu({ items, onNavigate }) {
  return (
    <div className="ff-dropdown">
      {items.map((item) => (
        <button
          key={item.id}
          className="ff-dropdown-item"
          onClick={() => onNavigate("shop", item.id)}
        >
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
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!item.dropdown) {
    return (
      <button
        className={`ff-nav-link ${activePage === item.link ? "active" : ""}`}
        onClick={() => onNavigate(item.link)}
      >
        {item.label}
      </button>
    );
  }

  return (
    <div className="ff-nav-item-wrap" ref={ref}>
      <button
        className={`ff-nav-link has-dropdown ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
      >
        {item.label}
        <span className="ff-nav-caret">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div onMouseLeave={() => setOpen(false)}>
          <DropdownMenu items={item.dropdown} onNavigate={(page, filter) => { onNavigate(page, filter); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}

export default function Navbar({ page, setPage, activeIndustry, setActiveIndustry }) {
  const { state, dispatch, actions } = useStore();
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const isAdmin   = page.startsWith("admin");

  const handleNav = (targetPage, filter) => {
    if (filter) {
      setActiveIndustry?.(filter);
      setPage("shop");
    } else {
      setPage(targetPage);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="ff-ann-bar">
        <span className="ff-ann-text">
          🚚&nbsp; <strong>Free Shipping On Orders Over $99</strong>
          &nbsp;·&nbsp; In-Stock Orders Ship Within 24 Business Hours
          &nbsp;·&nbsp; <span className="ff-ann-link" onClick={() => setPage("shop")}>Shop Now →</span>
        </span>
      </div>

      {/* Main Nav */}
      <nav className="ff-nav">
        {/* Logo */}
        <div className="ff-logo" onClick={() => setPage("home")}>
          <div className="ff-logo-icon">
            <div className="ff-logo-diamond">⬧</div>
          </div>
          <div className="ff-logo-text">
            <span className="ff-logo-fox">FOX</span><span className="ff-logo-fury">FURY</span>
          </div>
        </div>

        {/* Center Nav */}
        {!isAdmin ? (
          <div className="ff-nav-links">
            {NAV.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                activePage={page}
                onNavigate={handleNav}
              />
            ))}
          </div>
        ) : (
          <div className="ff-nav-links">
            <button className="ff-nav-link" onClick={() => setPage("home")}>← Back to Store</button>
            <span style={{ color: "var(--muted)", fontSize: ".7rem" }}>|</span>
            <span className="ff-nav-link active">Admin Panel</span>
          </div>
        )}

        {/* Right actions */}
        <div className="ff-nav-actions">
          {/* Theme switcher */}
          <div className="ff-theme-selector">
            {Object.entries(THEME_COLORS).map(([t, { bg, label }]) => (
              <div
                key={t}
                className={`ff-theme-dot ${state.theme === t ? "active" : ""}`}
                style={{ background: bg }}
                onClick={() => dispatch({ type: "SET_THEME", payload: t })}
                title={label}
              />
            ))}
          </div>

          {/* Admin */}
          {state.user && (
            <button
              className={`ff-icon-btn ${isAdmin ? "active" : ""}`}
              onClick={() => setPage(isAdmin ? "home" : "admin")}
              title="Admin"
            >⚙</button>
          )}

          {/* Wishlist + Cart — only in store */}
          {!isAdmin && (
            <>
              <button className="ff-icon-btn" onClick={() => setPage("wishlist")} title="Wishlist">
                ♡
                {state.wishlist.length > 0 && <span className="ff-nav-badge">{state.wishlist.length}</span>}
              </button>
              <button className="ff-icon-btn cart-btn" onClick={() => dispatch({ type: "TOGGLE_CART" })} title="Cart">
                🛒
                {cartCount > 0 && <span className="ff-nav-badge">{cartCount}</span>}
              </button>
            </>
          )}

          {/* Auth */}
          {state.user ? (
            <div className="ff-user-chip" onClick={actions.logout} title="Sign out">
              <span>👤</span>
              <span>{state.user.first_name || state.user.email}</span>
              <span style={{ opacity: 0.4, fontSize: ".55rem" }}>✕</span>
            </div>
          ) : (
            <>
              <button
                className="ff-btn-ghost-sm"
                onClick={() => dispatch({ type: "OPEN_AUTH_MODAL", payload: "login" })}
              >SIGN IN</button>
              <button
                className="ff-btn-yellow"
                onClick={() => dispatch({ type: "OPEN_AUTH_MODAL", payload: "register" })}
              >REGISTER</button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
