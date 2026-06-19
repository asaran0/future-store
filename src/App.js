import { useState, useEffect } from "react";
import { StoreProvider, useStore } from "./store/StoreContext";
import { injectStyles } from "./theme/themes";
import GlobalStyles   from "./components/GlobalStyles";
import Navbar         from "./components/Navbar";
import CartDrawer     from "./components/CartDrawer";
import Notification   from "./components/Notification";
import AuthModal      from "./components/AuthModal";
import AdminLayout       from "./components/admin/AdminLayout";
import DashboardPage     from "./pages/admin/DashboardPage";
import CategoriesPage    from "./pages/admin/CategoriesPage";
import ProductsPage      from "./pages/admin/ProductsPage";
import ProductDetailPage from "./pages/admin/ProductDetailPage";
import HomePage      from "./pages/HomePage";
import ShopPage      from "./pages/ShopPage";
import WishlistPage  from "./pages/WishlistPage";
import OrdersPage    from "./pages/OrdersPage";

function AppInner() {
  const { state } = useStore();
  const [page, setPage] = useState("home");
  const [activeIndustry, setActiveIndustry] = useState("all");
  const isAdminPage = page === "admin" || page.startsWith("admin-");
  const adminSubPage = page.replace("admin-", "") || "dashboard";

  useEffect(() => { injectStyles(state.theme); }, [state.theme]);

  const navigate = (p) => { if (p === "admin") setPage("admin-dashboard"); else setPage(p); };
  const setAdminPage = (sub) => setPage(`admin-${sub}`);

  const handleShop = (targetPage, industryFilter) => {
    if (industryFilter) { setActiveIndustry(industryFilter); setPage("shop"); }
    else navigate(targetPage);
  };

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <GlobalStyles />
      <Navbar page={page} setPage={navigate} activeIndustry={activeIndustry} setActiveIndustry={setActiveIndustry} />

      {isAdminPage ? (
        state.user ? (
          <AdminLayout activePage={adminSubPage} setAdminPage={setAdminPage}>
            {adminSubPage === "dashboard"       && <DashboardPage    setAdminPage={setAdminPage} />}
            {adminSubPage === "categories"      && <CategoriesPage                               />}
            {adminSubPage === "products"        && <ProductsPage     setAdminPage={setAdminPage} />}
            {adminSubPage === "product-detail"  && <ProductDetailPage setAdminPage={setAdminPage} />}
          </AdminLayout>
        ) : (
          <div style={{ minHeight:"100vh", paddingTop:104, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1rem" }}>
            <div style={{ fontFamily:"var(--fontDisplay)", fontSize:"1.5rem", color:"var(--accent)" }}>🔐 Admin Access Required</div>
            <div style={{ color:"var(--muted)", fontSize:".85rem" }}>Sign in to access the admin panel</div>
            <button className="ff-btn-yellow" style={{ marginTop:".5rem" }} onClick={() => navigate("home")}>← Back to Store</button>
          </div>
        )
      ) : (
        <>
          {page === "home"     && <HomePage     setPage={handleShop} setActiveIndustry={setActiveIndustry} />}
          {page === "shop"     && <ShopPage     activeIndustry={activeIndustry} setActiveIndustry={setActiveIndustry} />}
          {page === "wishlist" && <WishlistPage setPage={navigate} />}
          {page === "orders"   && <OrdersPage   setPage={navigate} />}
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
