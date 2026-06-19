import { useStore } from "../store/StoreContext";

export default function CartDrawer() {
  const { state, dispatch } = useStore();
  const { cart, ui } = state;
  const subtotal = cart.reduce((s, i) => s + parseFloat(i.price || 0) * i.qty, 0);
  const shipping  = subtotal > 99 ? 0 : 9.99;
  const total     = subtotal + shipping;
  const close     = () => dispatch({ type: "TOGGLE_CART" });

  if (!ui.cartOpen) return null;

  return (
    <>
      <div className="ff-overlay" onClick={close} />
      <div className="ff-drawer">
        {/* Header */}
        <div className="ff-drawer-header">
          <div>
            <div className="ff-drawer-title">Your Cart</div>
            <div className="ff-drawer-sub">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
              {cart.length > 0 && ` · $${subtotal.toFixed(2)}`}
            </div>
          </div>
          <button className="ff-drawer-close" onClick={close}>✕</button>
        </div>

        {/* Items */}
        <div className="ff-drawer-body">
          {cart.length === 0 ? (
            <div className="ff-empty-state">
              <div className="ff-empty-icon">🛒</div>
              <div className="ff-empty-title">Your cart is empty</div>
              <div className="ff-empty-sub">Add FoxFury products to get started</div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="ff-cart-item">
                <div className="ff-cart-thumb">
                  {typeof item.image === "string" && item.image.startsWith("http")
                    ? <img src={item.image} alt={item.name} />
                    : item.image}
                </div>
                <div className="ff-cart-info">
                  <div className="ff-cart-name">{item.name}</div>
                  {item.variant && <div className="ff-cart-variant">{item.variant}</div>}
                  <div className="ff-cart-price">${(parseFloat(item.price) * item.qty).toFixed(2)}</div>
                </div>
                <div className="ff-cart-controls">
                  <button className="ff-qty-btn" onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty - 1 } })}>−</button>
                  <span className="ff-qty-val">{item.qty}</span>
                  <button className="ff-qty-btn" onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty + 1 } })}>+</button>
                  <button className="ff-cart-remove" onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}>🗑</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="ff-drawer-footer">
            <div className="ff-cart-summary">
              <div className="ff-cart-summary-row">
                <span className="ff-cart-summary-lbl">Subtotal</span>
                <span className="ff-cart-summary-val">${subtotal.toFixed(2)}</span>
              </div>
              <div className="ff-cart-summary-row">
                <span className="ff-cart-summary-lbl">Shipping</span>
                <span className="ff-cart-summary-val" style={{ color: shipping === 0 ? "var(--success)" : "" }}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping === 0 && (
                <div style={{ fontSize: ".6rem", color: "var(--success)", fontFamily: "var(--fontMono)" }}>
                  ✓ Free shipping on orders over $99
                </div>
              )}
            </div>
            <div className="ff-cart-total-row">
              <span className="ff-cart-total-lbl">Total</span>
              <span className="ff-cart-total-val">${total.toFixed(2)}</span>
            </div>
            <button className="ff-checkout-btn" onClick={() => dispatch({ type: "PLACE_ORDER" })}>
              ⚡ PLACE ORDER
            </button>
          </div>
        )}
      </div>
    </>
  );
}
