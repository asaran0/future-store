import { useStore } from "../store/StoreContext";

const CATEGORY_EMOJI = {
  "scene-lights":   "💡", "headlamps": "🔦", "flashlights": "🔋",
  "shield-lights":  "🛡", "area-lights": "☀", "drone-lights": "🚁",
  "forensic-lights":"🔬", default: "📦",
};

function getBadgeClass(badge) {
  const map = { "BESTSELLER":"bestseller","HOT":"hot","NEW":"new","SALE":"sale","PRO":"pro","FORENSICS":"forensics" };
  return map[badge] || "new";
}

export default function ProductCard({ product }) {
  const { state, dispatch } = useStore();
  const inWish = state.wishlist.some((i) => i.id === product.id);

  const imageUrl  = product.ProductMedia?.find((m) => m.is_primary)?.url || product.ProductMedia?.[0]?.url || null;
  const price     = product.price || parseFloat(product.ProductVariants?.[0]?.msrp || 0) || null;
  const specs     = product.specs || product.ProductVariants?.slice(0,4).map((v) => v.color || v.variant_name) || [];
  const emoji     = CATEGORY_EMOJI[product.category] || CATEGORY_EMOJI.default;

  const cartPayload = {
    id: product.id, name: product.name, price,
    image: imageUrl || emoji,
    sku: product.sku, brand: product.brand,
    variant: product.ProductVariants?.[0]?.variant_name || null,
  };

  return (
    <div className="ff-card">
      {/* Image */}
      <div className={`ff-card-img ${imageUrl ? "has-url" : ""}`}>
        {product.badge && (
          <span className={`ff-card-badge ${getBadgeClass(product.badge)}`}>{product.badge}</span>
        )}
        {imageUrl
          ? <img src={imageUrl} alt={product.name} />
          : <span className="ff-card-emoji">{emoji}</span>
        }
        <button
          className={`ff-card-wish ${inWish ? "active" : ""}`}
          onClick={(e) => { e.stopPropagation(); dispatch({ type: "TOGGLE_WISHLIST", payload: { ...product, ...cartPayload } }); }}
        >{inWish ? "♥" : "♡"}</button>
      </div>

      {/* Body */}
      <div className="ff-card-body">
        <div className="ff-card-brand">{product.brand || "FoxFury"}</div>
        <div className="ff-card-name">{product.name}</div>
        <div className="ff-card-desc">{product.description}</div>

        {specs.length > 0 && (
          <div className="ff-card-specs">
            {specs.slice(0,4).map((s, i) => <span key={i} className="ff-spec-tag">{s}</span>)}
          </div>
        )}

        <div className="ff-card-footer">
          <div>
            {price ? (
              <div className="ff-card-price">${parseFloat(price).toFixed(2)}</div>
            ) : (
              <div className="ff-card-price-na">Contact for Price</div>
            )}
            {product.rating && (
              <div className="ff-card-rating">
                ★ {product.rating}
                <span style={{ color: "var(--muted)" }}> ({product.reviews?.toLocaleString()})</span>
              </div>
            )}
          </div>
          <button className="ff-add-btn" onClick={() => dispatch({ type: "ADD_TO_CART", payload: cartPayload })}>
            + ADD
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="ff-skeleton-card">
      <div className="ff-skeleton" style={{ height: 180 }} />
      <div className="ff-skeleton-body">
        <div className="ff-skeleton" style={{ height: 10, width: "40%" }} />
        <div className="ff-skeleton" style={{ height: 14, width: "85%" }} />
        <div className="ff-skeleton" style={{ height: 10, width: "90%" }} />
        <div className="ff-skeleton" style={{ height: 10, width: "70%" }} />
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:".5rem" }}>
          <div className="ff-skeleton" style={{ height: 18, width: "35%" }} />
          <div className="ff-skeleton" style={{ height: 32, width: "25%", borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}
