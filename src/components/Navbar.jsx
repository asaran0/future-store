import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../store/StoreContext";
import { api } from "../services/api";
import { NAV } from "../data/foxfury";

const THEME_DOTS = { black:"#1a1a2e", dark:"#4f46e5", cyber:"#00ffc8", light:"#ccccdd" };

/* slug → icon map */
const SLUG_ICON = {
  "drones":          "🚁",
  "fire-rescue-ems": "🔥",
  "forensics":       "🔬",
  "industrial":      "🏗",
  "law-enforcement": "🛡",
  "photo-video-film":"🎬",
  "military":        "⚔",
};

/* ── Shop-by-Industry mega-panel ───────────────────────────── */
function IndustryPanel({ onClose }) {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    // Use store data if available, avoid extra network call
    if (state.industries?.data?.length) {
      setIndustries(state.industries.data.filter(i => i.isActive !== false));
      setLoading(false);
      return;
    }
    let alive = true;
    api.get("/industry")
      .then(res => {
        if (!alive) return;
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setIndustries(list.filter(i => i.isActive !== false));
      })
      .catch(() => { if (alive) setIndustries([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [state.industries?.data]);

  const handleClick = (ind) => {
    dispatch({ type:"SET_FILTER", payload:{ industryId: ind.id } });
    navigate("/shop");
    onClose();
  };

  return (
    <div className="ff-industry-panel">
      <div className="ff-industry-panel-inner">
        <div className="ff-industry-panel-header">INDUSTRIES WE SUPPORT</div>
        {loading && (
          <div className="ff-industry-panel-grid">
            {[...Array(6)].map((_, i) => <div key={i} className="ff-industry-panel-skeleton" />)}
          </div>
        )}
        {!loading && industries.length === 0 && (
          <div className="ff-industry-panel-empty">No industries found</div>
        )}
        {!loading && industries.length > 0 && (
          <div className="ff-industry-panel-grid">
            {industries.map(ind => (
              <button key={ind.id} className="ff-industry-panel-item" onClick={() => handleClick(ind)}>
                <span className="ff-industry-panel-icon">{SLUG_ICON[ind.slug] || "⬡"}</span>
                <div className="ff-industry-panel-text">
                  <div className="ff-industry-panel-name">{ind.name}</div>
                  {ind.description && <div className="ff-industry-panel-desc">{ind.description}</div>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Generic dropdown ──────────────────────────────────────── */
function GenericDropdown({ items, onClose }) {
  const navigate = useNavigate();
  const { dispatch } = useStore();
  return (
    <div className="ff-dropdown">
      <div className="ff-dropdown-inner">
        {items.map((item) => (
          <button key={item.id} className="ff-dropdown-item"
            onClick={() => {
              dispatch({ type:"SET_FILTER", payload:{ industryId: item.id } });
              navigate("/shop");
              onClose();
            }}>
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

/* ── Single nav item ───────────────────────────────────────── */
function NavItem({ item, activeId, setActiveId }) {
  const ref     = useRef(null);
  const navigate  = useNavigate();
  const location  = useLocation();
  const isOpen    = activeId === item.id;
  const isActive  = location.pathname === `/${item.link}` || (item.link === "home" && location.pathname === "/");

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setActiveId(null); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [setActiveId]);

  if (!item.dropdown) {
    return (
      <button
        className={`ff-nav-link ${isActive ? "active" : ""}`}
        onClick={() => { setActiveId(null); navigate(item.link === "home" ? "/" : `/${item.link}`); }}
      >
        {item.label}
      </button>
    );
  }

  return (
    <div className="ff-nav-item-wrap" ref={ref}
      onMouseEnter={() => setActiveId(item.id)}
      onMouseLeave={() => setActiveId(null)}
    >
      <button className={`ff-nav-link ${isOpen ? "open" : ""}`}
        onClick={() => setActiveId(isOpen ? null : item.id)}>
        {item.label} <span className="ff-nav-caret">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        item.id === "shop-by-industry"
          ? <IndustryPanel onClose={() => setActiveId(null)} />
          : <GenericDropdown items={item.dropdown} onClose={() => setActiveId(null)} />
      )}
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────────── */
export default function Navbar() {
  const { state, dispatch, actions } = useStore();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [activeId, setActiveId] = useState(null);

  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);
  const isAdmin   = location.pathname.startsWith("/admin");

  return (
    <>
      <div className="ff-ann-bar">
        🚚&nbsp;<strong>Free Shipping On Orders Over $99</strong>
        &nbsp;·&nbsp;In-Stock Orders Ship Within 24 Hours
        <span className="ff-ann-link" onClick={() => navigate("/shop")}>&nbsp;Shop Now →</span>
      </div>

      <nav className="ff-nav">
        <div className="ff-logo" onClick={() => navigate("/")}>
          <span className="ff-logo-fox">FOX</span><span className="ff-logo-fury">FURY</span>
        </div>

        {!isAdmin ? (
          <div className="ff-nav-links">
            {NAV.map((item) => (
              <NavItem key={item.id} item={item} activeId={activeId} setActiveId={setActiveId} />
            ))}
          </div>
        ) : (
          <div className="ff-nav-links">
            <button className="ff-nav-link" onClick={() => navigate("/")}>← Store</button>
            <span style={{ color:"var(--muted)", fontSize:".55rem" }}>|</span>
            <span className="ff-nav-link active">Admin Panel</span>
          </div>
        )}

        <div className="ff-nav-actions">
          <div className="ff-theme-selector">
            {Object.entries(THEME_DOTS).map(([t, c]) => (
              <div key={t} className={`ff-theme-dot ${state.theme === t ? "active" : ""}`}
                style={{ background: c }} onClick={() => dispatch({ type:"SET_THEME", payload:t })} title={t} />
            ))}
          </div>

          {state.user && (
            <button className={`ff-icon-btn ${isAdmin ? "active" : ""}`}
              onClick={() => navigate(isAdmin ? "/" : "/admin")} title="Admin">⚙</button>
          )}

          {!isAdmin && (
            <>
              <button className="ff-icon-btn" onClick={() => navigate("/wishlist")} title="Wishlist">
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
              <button className="ff-btn-ghost-nav" onClick={() => dispatch({ type:"OPEN_AUTH_MODAL", payload:"login" })}>SIGN IN</button>
              <button className="ff-btn-outline-nav" onClick={() => dispatch({ type:"OPEN_AUTH_MODAL", payload:"register" })}>REGISTER</button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
