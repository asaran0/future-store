import { useStore } from "../store/StoreContext";

export default function OrdersPage({ setPage }) {
  const { state, dispatch } = useStore();
  const { orders, user } = state;

  if (!user) {
    return (
      <div className="ff-page">
        <div className="ff-page-header">
          <div className="ff-page-title">Orders</div>
        </div>
        <div className="ff-empty-state" style={{ padding: "5rem 2rem" }}>
          <div className="ff-empty-icon">🔐</div>
          <div className="ff-empty-title">Sign in to view your orders</div>
          <div className="ff-empty-sub">Your FoxFury order history will appear here</div>
          <button
            className="ff-btn-yellow"
            style={{ marginTop: "1.5rem" }}
            onClick={() => dispatch({ type: "OPEN_AUTH_MODAL", payload: "login" })}
          >
            SIGN IN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ff-page">
      <div className="ff-page-header">
        <div className="ff-page-title">Orders</div>
        <div className="ff-page-sub">
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </div>
      </div>

      <div style={{ padding: "2rem 4rem" }}>
        {orders.length === 0 ? (
          <div className="ff-empty-state" style={{ padding: "5rem 2rem" }}>
            <div className="ff-empty-icon">📦</div>
            <div className="ff-empty-title">No orders yet</div>
            <div className="ff-empty-sub">Your placed orders will appear here</div>
            <button className="ff-btn-yellow" style={{ marginTop: "1.5rem" }} onClick={() => setPage("shop")}>
              START SHOPPING →
            </button>
          </div>
        ) : (
          orders.slice().reverse().map((order) => (
            <div key={order.id} className="ff-order-card">
              <div className="ff-order-header">
                <div>
                  <div className="ff-order-id">{order.id}</div>
                  <div className="ff-order-date">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      weekday: "short", month: "long", day: "numeric", year: "numeric",
                    })}
                  </div>
                </div>
                <div className="ff-order-meta">
                  <span className={`ff-status-badge ${order.status}`}>{order.status}</span>
                  <span className="ff-order-total">${parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>
              <div className="ff-order-items">
                {order.items.map((item) => (
                  <span key={item.id} className="ff-order-item-tag">
                    {typeof item.image === "string" && !item.image.startsWith("http") ? item.image + " " : ""}
                    {item.name} ×{item.qty}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
