import { useState, useRef, useEffect } from "react";
import { useStore } from "../store/StoreContext";
import { api } from "../services/api";
import { NAV } from "../data/foxfury";

const THEME_DOTS = { black:"#1a1a2e", dark:"#4f46e5", cyber:"#00ffc8", light:"#ccccdd" };

/* slug → icon map (API has no icon field) */
const SLUG_ICON = {
  "drones":          "🚁",
  "fire-rescue-ems": "🔥",
  "forensics":       "🔬",
  "industrial":      "🏗",
  "law-enforcement": "🛡",
  "photo-video-film":"🎬",
  "military":        "⚔",
};

/* ── Shop-by-Industry mega-panel (3×3 grid, API-driven) ────── */
function IndustryPanel({ onNavigate, onClose }) {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    let alive = true;
    api.get("/industry")
      .then(res => {
        if (!alive) return;
        // API returns { success: true, data: [...] }
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setIndustries(list.filter(i => i.isActive !== false));
      })
      .catch(() => {
        if (alive) setIndustries([]);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  // Build rows of 3
  const rows = [];
  for (let i = 0; i < industries.length; i += 3) {
    rows.push(industries.slice(i, i + 3));
  }

  return (
    <div className="ff-industry-panel">
      <div className="ff-industry-panel-inner">
      <div className="ff-industry-panel-header">INDUSTRIES WE SUPPORT</div>

      {loading && (
        <div className="ff-industry-panel-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ff-industry-panel-skeleton" />
          ))}
        </div>
      )}

      {!loading && industries.length === 0 && (
        <div className="ff-industry-panel-empty">No industries found</div>
      )}

      {!loading && industries.length > 0 && (
        <div className="ff-industry-panel-grid">
          {industries.map(ind => (
            <button
              key={ind.id}
              className="ff-industry-panel-item"
              onClick={() => { onNavigate("shop", ind.id); onClose(); }}
            >
              <span className="ff-industry-panel-icon">
                {SLUG_ICON[ind.slug] || "⬡"}
              </span>
              <div className="ff-industry-panel-text">
                <div className="ff-industry-panel-name">{ind.name}</div>
                {ind.description && (
                  <div className="ff-industry-panel-desc">{ind.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

/* ── Generic dropdown for non-industry nav items ────────────── */
function GenericDropdown({ items, onNavigate, onClose }) {
  return (
    <div className="ff-dropdown">
      <div className="ff-dropdown-inner">
        {items.map((item) => (
          <button key={item.id} className="ff-dropdown-item"
            onClick={() => { onNavigate("shop", item.id); onClose(); }}>
            <span className="ff-dropdown-icon">{item.icon}</span>
            <div>
              <div className="ff-dropdown-label">{item.label}</div>
              <div className="ff-dropdown-desc">{item.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Single nav item — receives activeId + setActiveId ──────── */
function NavItem({ item, activePage, onNavigate, activeId, setActiveId }) {
  const ref = useRef(null);
  const isOpen = activeId === item.id;

  // Close on outside click
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setActiveId(null);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [setActiveId]);

  if (!item.dropdown) {
    return (
      <button
        className={`ff-nav-link ${activePage === item.link ? "active" : ""}`}
        onClick={() => { setActiveId(null); onNavigate(item.link); }}
      >
        {item.label}
      </button>
    );
  }

  const openMenu  = () => setActiveId(item.id);
  const closeMenu = () => setActiveId(null);
  const toggleMenu = () => setActiveId(isOpen ? null : item.id);

  return (
    <div
      className="ff-nav-item-wrap"
      ref={ref}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        className={`ff-nav-link ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        {item.label} <span className="ff-nav-caret">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        item.id === "shop-by-industry"
          ? <IndustryPanel
              onNavigate={onNavigate}
              onClose={closeMenu}
            />
          : <GenericDropdown
              items={item.dropdown}
              onNavigate={onNavigate}
              onClose={closeMenu}
            />
      )}
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────────── */
export default function Navbar({ page, setPage }) {
  const { state, dispatch, actions } = useStore();
  const [activeId, setActiveId]       = useState(null); // ← single source of truth
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const isAdmin   = page.startsWith("admin");

  const handleNav = (targetPage, filter) => {
    if (filter) {
      dispatch({ type: "SET_FILTER", payload: { industryId: filter } });
      setPage("shop");
    } else {
      setPage(targetPage);
    }
    setActiveId(null);
  };

  return (
    <>
      {/* Slim announcement bar */}
      <div className="ff-ann-bar">
        🚚&nbsp;<strong>Free Shipping On Orders Over $99</strong>
        &nbsp;·&nbsp;In-Stock Orders Ship Within 24 Hours
        <span className="ff-ann-link" onClick={() => setPage("shop")}>&nbsp;Shop Now →</span>
      </div>

      {/* Main nav */}
      <nav className="ff-nav">
        <div className="ff-logo" onClick={() => setPage("home")}>
          <span className="ff-logo-fox">FOX</span><span className="ff-logo-fury">FURY</span>
        </div>

        {!isAdmin ? (
          <div className="ff-nav-links">
            {NAV.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                activePage={page}
                onNavigate={handleNav}
                activeId={activeId}
                setActiveId={setActiveId}
              />
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
