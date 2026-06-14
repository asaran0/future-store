import { useStore } from "../store/StoreContext";

export default function OrdersPage({ setPage }) {
  const { state } = useStore();
  const { orders, user } = state;

  if (!user) {
    return (
      <div className="fs-page">
        <div className="fs-page-header">
          <div className="fs-page-title">ORDERS</div>
        </div>
        <div className="fs-empty-state" style={{ padding: "5rem 2rem" }}>
          <div className="fs-empty-icon">🔐</div>
          <div className="fs-empty-title">Sign in to view orders</div>
          <div className="fs-empty-sub">Your order history will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fs-page">
      <div className="fs-page-header">
        <div className="fs-page-title">ORDERS</div>
        <div className="fs-page-sub">
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </div>
      </div>

      <div className="fs-section" style={{ paddingTop: 0 }}>
        {orders.length === 0 ? (
          <div className="fs-empty-state" style={{ padding: "5rem 2rem" }}>
            <div className="fs-empty-icon">📦</div>
            <div className="fs-empty-title">No orders yet</div>
            <div className="fs-empty-sub">Your placed orders will appear here</div>
            <button
              className="fs-btn-primary"
              style={{ marginTop: "1.5rem" }}
              onClick={() => setPage("shop")}
            >
              START SHOPPING →
            </button>
          </div>
        ) : (
          orders.slice().reverse().map((order) => (
            <div key={order.id} className="fs-order-card">
              <div className="fs-order-header">
                <div>
                  <div className="fs-order-id">{order.id}</div>
                  <div className="fs-order-date">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      weekday: "short", month: "long", day: "numeric", year: "numeric",
                    })}
                  </div>
                </div>
                <div className="fs-order-meta">
                  <span className={`fs-status-badge ${order.status}`}>
                    {order.status}
                  </span>
                  <span className="fs-order-total">${parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>

              <div className="fs-order-items">
                {order.items.map((item) => (
                  <span key={item.id} className="fs-order-item-tag">
                    {typeof item.image === "string" && !item.image.startsWith("http")
                      ? item.image + " "
                      : ""
                    }{item.name} ×{item.qty}
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
