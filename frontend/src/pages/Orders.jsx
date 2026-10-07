import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "/api/orders/my-orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load orders"
          );
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Orders error:", error);

        setError(
          error.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <span className="eyebrow">ORDERS</span>

            <h1>My Orders</h1>

            <p>Loading your orders...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <span className="eyebrow">ORDERS</span>

            <h1>My Orders</h1>

            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">

        {/* Header */}
        <div className="cart-header">
          <span className="eyebrow">
            ORDER HISTORY
          </span>

          <h1>My Orders</h1>

          <p>
            View your previous orders and their status.
          </p>

          <span className="cart-count">
            {orders.length}{" "}
            {orders.length === 1 ? "Order" : "Orders"}
          </span>
        </div>

        {/* No Orders */}
        {orders.length === 0 ? (
          <div className="empty-cart">

            <div className="empty-cart-icon">
              📦
            </div>

            <h2>No orders yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <button
              className="checkout-btn"
              onClick={() => navigate("/")}
            >
              Start Shopping →
            </button>

          </div>
        ) : (

          /* Orders */
          <div className="cart-items">

            {orders.map((order) => (

              <div
                className="cart-item"
                key={order.id}
                onClick={() =>
                  navigate(`/orders/${order.id}`)
                }
                style={{
                  cursor: "pointer",
                }}
              >

                {/* Order Icon */}
                <div className="cart-item-image">
                  📦
                </div>

                {/* Order Information */}
                <div className="cart-item-info">

                  <span className="product-category">
                    ORDER #{order.id}
                  </span>

                  <h2>
                    {Number(
                      order.total_amount
                    ).toLocaleString()}{" "}
                    EGP
                  </h2>

                  <p>
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </p>

                </div>

                {/* Order Status */}
                <div className="cart-item-actions">

                  <div className="quantity-label">
                    Order Status
                  </div>

                  <strong>
                    {order.status}
                  </strong>

                  <div className="quantity-label">
                    Payment
                  </div>

                  <strong>
                    {order.payment_status}
                  </strong>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </main>
  );
}

export default Orders;
