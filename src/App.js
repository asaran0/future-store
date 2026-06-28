import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { StoreProvider, useStore } from "./store/StoreContext";
import { injectStyles } from "./theme/themes";
import GlobalStyles        from "./components/GlobalStyles";
import Navbar              from "./components/Navbar";
import CartDrawer          from "./components/CartDrawer";
import Notification        from "./components/Notification";
import AuthModal           from "./components/AuthModal";
import AdminLayout         from "./components/admin/AdminLayout";
import DashboardPage       from "./pages/admin/DashboardPage";
import CategoriesPage      from "./pages/admin/CategoriesPage";
import ProductsPage        from "./pages/admin/ProductsPage";
import ProductDetailPage   from "./pages/admin/ProductDetailPage";
import IndustriesPage      from "./pages/admin/IndustriesPage";
import InventoryPage       from "./pages/admin/InventoryPage";
import HomePage            from "./pages/HomePage";
import ShopPage            from "./pages/ShopPage";
import WishlistPage        from "./pages/WishlistPage";
import OrdersPage          from "./pages/OrdersPage";

/* ── Scroll to top on every navigation ─────────────────────── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* ── Admin guard ─────────────────────────────────────────────── */
function RequireAuth({ children }) {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  if (!state.user) return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1rem" }}>
      <div style={{ fontFamily:"var(--fontDisplay)", fontSize:"1.4rem", color:"var(--accent)" }}>🔐 Admin Access Required</div>
      <div style={{ color:"var(--muted)", fontSize:".82rem" }}>Sign in to access the admin panel</div>
      <div style={{ display:"flex", gap:".75rem", marginTop:".5rem" }}>
        <button className="ff-btn-primary" onClick={() => dispatch({ type:"OPEN_AUTH_MODAL", payload:"login" })}>SIGN IN</button>
        <button className="ff-btn-sm" onClick={() => navigate("/")}>← Back to Store</button>
      </div>
    </div>
  );
  return children;
}

/* ── Admin wrapper — provides setAdminPage via useNavigate ──── */
function AdminSection() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sub = pathname.replace(/^\/admin\/?/, "") || "dashboard";
  const setAdminPage = (page) => navigate(`/admin/${page}`);

  return (
    <RequireAuth>
      <AdminLayout activePage={sub} setAdminPage={setAdminPage}>
        <Routes>
          <Route index                    element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"         element={<DashboardPage     setAdminPage={setAdminPage} />} />
          <Route path="categories"        element={<CategoriesPage    />} />
          <Route path="products"          element={<ProductsPage      setAdminPage={setAdminPage} />} />
          <Route path="product-detail"    element={<ProductDetailPage setAdminPage={setAdminPage} />} />
          <Route path="industries"        element={<IndustriesPage    />} />
          <Route path="inventory"         element={<InventoryPage     />} />
          <Route path="*"                 element={<Navigate to="dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </RequireAuth>
  );
}

/* ── Main app inner ──────────────────────────────────────────── */
function AppInner() {
  const { state } = useStore();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => { injectStyles(state.theme); }, [state.theme]);

  return (
    <div style={{ position:"relative", zIndex:1 }}>
      <GlobalStyles />
      <Navbar />

      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/shop"      element={<ShopPage />} />
        <Route path="/wishlist"  element={<WishlistPage />} />
        <Route path="/orders"    element={<OrdersPage />} />
        <Route path="/admin/*"   element={<AdminSection />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>

      <CartDrawer />
      <AuthModal />
      <Notification />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <AppInner />
      </StoreProvider>
    </BrowserRouter>
  );
}
