import { useStore } from "../../store/StoreContext";
import { AdminGlobalStyles } from "../GlobalStyles";

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",  icon: "◈" },
  { id: "products",   label: "Products",   icon: "⬡" },
  { id: "categories", label: "Categories", icon: "◉" },
];

export default function AdminLayout({ activePage, setAdminPage, children }) {
  const { state, actions } = useStore();
  return (
    <>
      <AdminGlobalStyles />
      <div className="adm-shell">
        <aside className="adm-sidebar">
          <div className="adm-sidebar-brand">
            <div className="adm-sidebar-logo">
              <span style={{ color: "var(--text)" }}>FOX</span>
              <span style={{ color: "var(--accent)" }}>FURY</span>
            </div>
            <div className="adm-sidebar-tag">Admin Panel</div>
          </div>
          <nav className="adm-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`adm-nav-item ${activePage === item.id ? "active" : ""}`}
                onClick={() => setAdminPage(item.id)}
              >
                <span className="adm-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="adm-sidebar-footer">
            <div className="adm-user-info">
              <div className="adm-user-avatar">
                {(state.user?.first_name?.[0] || "A").toUpperCase()}
              </div>
              <div>
                <div className="adm-user-name">{state.user?.first_name} {state.user?.last_name}</div>
                <div className="adm-user-role">{state.user?.user_type || "admin"}</div>
              </div>
            </div>
            <button className="adm-logout-btn" onClick={actions.logout} title="Sign out">⏻</button>
          </div>
        </aside>
        <main className="adm-main">{children}</main>
      </div>
    </>
  );
}
