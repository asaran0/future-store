import { useStore } from "../store/StoreContext";
import { getPrimaryImage, getStartingPrice } from "../services/productService";

// Emoji fallback map by category name
const CATEGORY_EMOJI = {
  electronics:  "⚡",
  smartphones:  "📱",
  laptops:      "💻",
  audio:        "🎧",
  wearables:    "⌚",
  gaming:       "🎮",
  apparel:      "👕",
  accessories:  "🔌",
  default:      "📦",
};

function getCategoryEmoji(categoryName = "") {
  const key = categoryName.toLowerCase();
  return CATEGORY_EMOJI[key] || CATEGORY_EMOJI.default;
}

export default function ProductCard({ product }) {
  const { state, dispatch } = useStore();
  const inWish = state.wishlist.some((i) => i.id === product.id);

  const imageUrl     = getPrimaryImage(product);
  const startPrice   = getStartingPrice(product);
  const variantCount = product.ProductVariants?.length || 0;
  const firstVariant = product.ProductVariants?.[0];

  // Normalise the cart payload — use first variant's SKU/price if available
  const cartPayload = {
    id:       product.id,
    name:     product.name,
    price:    startPrice || firstVariant?.msrp || 0,
    image:    imageUrl || getCategoryEmoji(product.category_name || product.brand),
    sku:      firstVariant?.sku || product.sku,
    brand:    product.brand,
    variant:  firstVariant?.variant_name || null,
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: "ADD_TO_CART", payload: cartPayload });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_WISHLIST", payload: { ...product, ...cartPayload } });
  };

  return (
    <div className="fs-card">
      {/* Image area */}
      <div className={`fs-card-img ${imageUrl ? "has-url" : ""}`}>
        {product.status === "new" && <span className="fs-card-badge NEW">NEW</span>}

        {imageUrl
          ? <img src={imageUrl} alt={product.name} />
          : <span role="img" style={{ position: "relative", zIndex: 1 }}>
              {getCategoryEmoji(product.brand)}
            </span>
        }

        <button
          className={`fs-card-wish ${inWish ? "active" : ""}`}
          onClick={handleWishlist}
          title={inWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          {inWish ? "♥" : "♡"}
        </button>
      </div>

      {/* Body */}
      <div className="fs-card-body">
        <div className="fs-card-cat">{product.brand || "N.JEY"}</div>
        <div className="fs-card-name">{product.name}</div>
        <div className="fs-card-desc">{product.description}</div>

        {/* Variant tags */}
        {variantCount > 0 && (
          <div className="fs-card-specs">
            {product.ProductVariants.slice(0, 3).map((v) => (
              <span key={v.id} className="fs-spec-tag">
                {v.color || v.variant_name}
              </span>
            ))}
            {variantCount > 3 && (
              <span className="fs-spec-tag">+{variantCount - 3} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="fs-card-footer">
          <div>
            {startPrice != null ? (
              <>
                <div className="fs-card-price">${parseFloat(startPrice).toFixed(2)}</div>
                {variantCount > 1 && (
                  <div className="fs-card-price-sub">from {variantCount} variants</div>
                )}
              </>
            ) : (
              <div className="fs-card-price" style={{ color: "var(--muted)", fontSize: ".8rem" }}>
                Price on request
              </div>
            )}
          </div>
          <button className="fs-add-btn" onClick={handleAddToCart}>
            + ADD
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton placeholder while loading ───────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="fs-skeleton-card">
      <div className="fs-skeleton-img fs-skeleton" />
      <div className="fs-skeleton-body">
        <div className="fs-skeleton" style={{ height: 10, width: "40%" }} />
        <div className="fs-skeleton" style={{ height: 14, width: "80%" }} />
        <div className="fs-skeleton" style={{ height: 10, width: "90%" }} />
        <div className="fs-skeleton" style={{ height: 10, width: "70%" }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".5rem" }}>
          <div className="fs-skeleton" style={{ height: 18, width: "35%" }} />
          <div className="fs-skeleton" style={{ height: 30, width: "25%", borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}
