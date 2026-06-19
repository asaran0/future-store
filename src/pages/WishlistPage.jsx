import { useStore } from "../store/StoreContext";
import ProductCard from "../components/ProductCard";

export default function WishlistPage({ setPage }) {
  const { state, dispatch } = useStore();
  const { wishlist } = state;

  return (
    <div className="ff-page">
      <div className="ff-page-header">
        <div className="ff-page-title">♥ Wishlist</div>
        <div className="ff-page-sub">
          {wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div style={{ padding: "2rem 4rem" }}>
        {wishlist.length === 0 ? (
          <div className="ff-empty-state" style={{ padding: "5rem 2rem" }}>
            <div className="ff-empty-icon">♡</div>
            <div className="ff-empty-title">No saved items yet</div>
            <div className="ff-empty-sub">Browse FoxFury products and heart the ones you love</div>
            <button className="ff-btn-yellow" style={{ marginTop: "1.5rem" }} onClick={() => setPage("shop")}>
              BROWSE PRODUCTS →
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.5rem" }}>
              <button
                className="ff-btn-yellow"
                onClick={() => wishlist.forEach((p) =>
                  dispatch({ type: "ADD_TO_CART", payload: {
                    id: p.id, name: p.name,
                    price: p.price || p.ProductVariants?.[0]?.msrp || 0,
                    image: p.image || "📦", sku: p.sku,
                  }})
                )}
              >
                ADD ALL TO CART
              </button>
              <button className="ff-btn-outline-sm" onClick={() => setPage("shop")}>
                CONTINUE SHOPPING
              </button>
            </div>
            <div className="ff-grid">
              {wishlist.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
