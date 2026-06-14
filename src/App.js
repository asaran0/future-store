import { useState, useEffect } from "react";
import { StoreProvider, useStore } from "./store/StoreContext";
import { injectStyles } from "./theme/themes";

// Components
import GlobalStyles  from "./components/GlobalStyles";
import Navbar        from "./components/Navbar";
import CartDrawer    from "./components/CartDrawer";
import Notification  from "./components/Notification";
import AuthModal     from "./components/AuthModal";

// Store pages
import HomePage      from "./pages/HomePage";
import ShopPage      from "./pages/ShopPage";
import WishlistPage  from "./pages/WishlistPage";
import OrdersPage    from "./pages/OrdersPage";

// Admin
import AdminLayout        from "./components/admin/AdminLayout";
import DashboardPage      from "./pages/admin/DashboardPage";
import CategoriesPage     from "./pages/admin/CategoriesPage";
import ProductsPage       from "./pages/admin/ProductsPage";
import ProductDetailPage  from "./pages/admin/ProductDetailPage";

function AppInner() {
  const { state } = useStore();
  const [page, setPage] = useState("home");

  // Admin sub-pages are prefixed with "admin-"
  const isAdminPage = page === "admin" || page.startsWith("admin-");

  useEffect(() => {
    injectStyles(state.theme);
  }, [state.theme]);

  // Navigate helper — "admin" shortcut goes to admin dashboard
  const navigate = (p) => {
    if (p === "admin") setPage("admin-dashboard");
    else setPage(p);
  };

  // Admin sub-page map
  const adminSubPage = page.replace("admin-", "") || "dashboard";
  const setAdminPage = (sub) => setPage(`admin-${sub}`);

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <GlobalStyles />
      <Navbar page={page} setPage={navigate} />

      {/* ── Admin layout ───────────────────────────────────── */}
      {isAdminPage ? (
        state.user ? (
          <AdminLayout activePage={adminSubPage} setAdminPage={setAdminPage}>
            {adminSubPage === "dashboard"      && <DashboardPage    setAdminPage={setAdminPage} />}
            {adminSubPage === "categories"     && <CategoriesPage                              />}
            {adminSubPage === "products"       && <ProductsPage     setAdminPage={setAdminPage} />}
            {adminSubPage === "product-detail" && <ProductDetailPage setAdminPage={setAdminPage} />}
          </AdminLayout>
        ) : (
          // Not logged in → show login prompt
          <div style={{ minHeight: "100vh", paddingTop: 64, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
            <div style={{ fontFamily: "var(--fontDisplay)", fontSize: "1.5rem", color: "var(--text)" }}>🔐 Admin Access</div>
            <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>Sign in to access the admin panel</div>
            <button className="fs-btn-primary" style={{ marginTop: ".5rem" }} onClick={() => navigate("home")}>
              ← Go to Store
            </button>
          </div>
        )
      ) : (
        /* ── Store pages ──────────────────────────────────── */
        <>
          {page === "home"     && <HomePage     setPage={navigate} />}
          {page === "shop"     && <ShopPage     setPage={navigate} />}
          {page === "wishlist" && <WishlistPage setPage={navigate} />}
          {page === "orders"   && <OrdersPage   setPage={navigate} />}
        </>
      )}

      {/* Global overlays */}
      <CartDrawer />
      <AuthModal  />
      <Notification />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  );
}
