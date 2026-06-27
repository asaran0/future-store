import { useState, useEffect } from "react";
import { StoreProvider, useStore } from "./store/StoreContext";
import { injectStyles } from "./theme/themes";
import GlobalStyles     from "./components/GlobalStyles";
import Navbar           from "./components/Navbar";
import CartDrawer       from "./components/CartDrawer";
import Notification     from "./components/Notification";
import AuthModal        from "./components/AuthModal";
import AdminLayout      from "./components/admin/AdminLayout";
import DashboardPage    from "./pages/admin/DashboardPage";
import CategoriesPage   from "./pages/admin/CategoriesPage";
import ProductsPage     from "./pages/admin/ProductsPage";
import ProductDetailPage from "./pages/admin/ProductDetailPage";
import IndustriesPage   from "./pages/admin/IndustriesPage";
import InventoryPage    from "./pages/admin/InventoryPage";
import HomePage         from "./pages/HomePage";
import ShopPage         from "./pages/ShopPage";
import WishlistPage     from "./pages/WishlistPage";
import OrdersPage       from "./pages/OrdersPage";

function AppInner() {
  const { state } = useStore();
  const [page, setPage] = useState("home");
  const isAdmin = page === "admin" || page.startsWith("admin-");
  const adminSub = page.replace("admin-", "") || "dashboard";

  useEffect(() => { injectStyles(state.theme); }, [state.theme]);

  const navigate = (p) => { if (p === "admin") setPage("admin-dashboard"); else setPage(p); };
  const setAdminPage = (sub) => setPage(`admin-${sub}`);

  return (
    <div style={{ position:"relative", zIndex:1 }}>
      <GlobalStyles />
      <Navbar page={page} setPage={navigate} />

      {isAdmin ? (
        state.user ? (
          <AdminLayout activePage={adminSub} setAdminPage={setAdminPage}>
            {adminSub==="dashboard"      && <DashboardPage     setAdminPage={setAdminPage} />}
            {adminSub==="categories"     && <CategoriesPage    />}
            {adminSub==="products"       && <ProductsPage      setAdminPage={setAdminPage} />}
            {adminSub==="product-detail" && <ProductDetailPage setAdminPage={setAdminPage} />}
            {adminSub==="industries"     && <IndustriesPage    />}
            {adminSub==="inventory"      && <InventoryPage     />}
          </AdminLayout>
        ) : (
          <div style={{ minHeight:"100vh", paddingTop:96, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1rem" }}>
            <div style={{ fontFamily:"var(--fontDisplay)", fontSize:"1.4rem", color:"var(--accent)" }}>🔐 Admin Access Required</div>
            <div style={{ color:"var(--muted)", fontSize:".82rem" }}>Sign in to access the admin panel</div>
            <button className="ff-btn-primary" style={{ marginTop:".5rem" }} onClick={() => navigate("home")}>← Back to Store</button>
          </div>
        )
      ) : (
        <>
          {page==="home"     && <HomePage     setPage={navigate} />}
          {page==="shop"     && <ShopPage     />}
          {page==="wishlist" && <WishlistPage  setPage={navigate} />}
          {page==="orders"   && <OrdersPage    setPage={navigate} />}
        </>
      )}

      <CartDrawer />
      <AuthModal />
      <Notification />
    </div>
  );
}

export default function App() {
  return <StoreProvider><AppInner /></StoreProvider>;
}
