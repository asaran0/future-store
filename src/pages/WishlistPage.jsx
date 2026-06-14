import { useStore } from "../store/StoreContext";
import ProductCard from "../components/ProductCard";

export default function WishlistPage({ setPage }) {
  const { state, dispatch } = useStore();
  const { wishlist } = state;

  return (
    <div className="fs-page">
      <div className="fs-page-header">
        <div className="fs-page-title">♥ WISHLIST</div>
        <div className="fs-page-sub">
          {wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="fs-section" style={{ paddingTop: 0 }}>
        {wishlist.length === 0 ? (
          <div className="fs-empty-state" style={{ padding: "5rem 2rem" }}>
            <div className="fs-empty-icon">♡</div>
            <div className="fs-empty-title">No saved items</div>
            <div className="fs-empty-sub">
              Browse the shop and heart products you love
            </div>
            <button
              className="fs-btn-primary"
              style={{ marginTop: "1.5rem" }}
              onClick={() => setPage("shop")}
            >
              BROWSE SHOP →
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.5rem", display: "flex", gap: ".75rem" }}>
              <button
                className="fs-btn-outline"
                style={{ height: 36, fontSize: ".6rem", padding: "0 1rem" }}
                onClick={() => {
                  wishlist.forEach((p) =>
                    dispatch({ type: "ADD_TO_CART", payload: {
                      id: p.id, name: p.name,
                      price: p.price || p.ProductVariants?.[0]?.msrp || 0,
                      image: p.image || "📦",
                    }})
                  );
                }}
              >
                ADD ALL TO CART
              </button>
            </div>
            <div className="fs-grid">
              {wishlist.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
