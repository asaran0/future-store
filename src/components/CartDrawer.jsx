import { useStore } from "../store/StoreContext";

export default function CartDrawer() {
  const { state, dispatch } = useStore();
  const { cart, ui } = state;

  const subtotal  = cart.reduce((s, i) => s + parseFloat(i.price) * i.qty, 0);
  const shipping  = subtotal > 500 ? 0 : 19.99;
  const total     = subtotal + shipping;

  const close = () => dispatch({ type: "TOGGLE_CART" });

  if (!ui.cartOpen) return null;

  return (
    <>
      <div className="fs-overlay" onClick={close} />

      <div className="fs-drawer">
        {/* Header */}
        <div className="fs-drawer-header">
          <div>
            <div className="fs-drawer-title">Your Cart</div>
            <div className="fs-drawer-sub">
              {cart.length} item{cart.length !== 1 ? "s" : ""}
              {cart.length > 0 && ` · $${subtotal.toFixed(2)}`}
            </div>
          </div>
          <button className="fs-drawer-close" onClick={close}>✕</button>
        </div>

        {/* Items */}
        <div className="fs-drawer-body">
          {cart.length === 0 ? (
            <div className="fs-empty-state">
              <div className="fs-empty-icon">🛒</div>
              <div className="fs-empty-title">Cart is empty</div>
              <div className="fs-empty-sub">Add some products to get started</div>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="fs-cart-item">
                <div className="fs-cart-thumb">
                  {typeof item.image === "string" && item.image.startsWith("http")
                    ? <img src={item.image} alt={item.name} />
                    : item.image}
                </div>

                <div className="fs-cart-info">
                  <div className="fs-cart-name">{item.name}</div>
                  {item.variant && (
                    <div className="fs-cart-variant">{item.variant}</div>
                  )}
                  <div className="fs-cart-price">
                    ${(parseFloat(item.price) * item.qty).toFixed(2)}
                  </div>
                </div>

                <div className="fs-cart-controls">
                  <button
                    className="fs-qty-btn"
                    onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty - 1 } })}
                  >−</button>
                  <span className="fs-qty-val">{item.qty}</span>
                  <button
                    className="fs-qty-btn"
                    onClick={() => dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty + 1 } })}
                  >+</button>
                  <button
                    className="fs-cart-remove"
                    onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
                    title="Remove"
                  >🗑</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="fs-drawer-footer">
            <div className="fs-cart-summary">
              <div className="fs-cart-summary-row">
                <span className="fs-cart-summary-lbl">Subtotal</span>
                <span className="fs-cart-summary-val">${subtotal.toFixed(2)}</span>
              </div>
              <div className="fs-cart-summary-row">
                <span className="fs-cart-summary-lbl">Shipping</span>
                <span className="fs-cart-summary-val">
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping === 0 && (
                <div style={{ fontSize: ".6rem", color: "var(--success)", fontFamily: "var(--fontMono)" }}>
                  ✓ Free shipping on orders over $500
                </div>
              )}
            </div>

            <div className="fs-cart-total-row">
              <span className="fs-cart-total-lbl">Total</span>
              <span className="fs-cart-total-val">${total.toFixed(2)}</span>
            </div>

            <button
              className="fs-checkout-btn"
              onClick={() => dispatch({ type: "PLACE_ORDER" })}
            >
              ⚡ PLACE ORDER
            </button>
          </div>
        )}
      </div>
    </>
  );
}
