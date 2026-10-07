import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load order"
          );
        }

        setOrder(data.order);
      } catch (error) {
        console.error("Order details error:", error);

        setError(
          error.message || "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <span className="eyebrow">ORDER DETAILS</span>

            <h1>Loading...</h1>

            <p>Loading your order details...</p>
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
            <span className="eyebrow">ORDER DETAILS</span>

            <h1>Order Not Found</h1>

            <p>{error}</p>

            <button
              className="checkout-btn"
              onClick={() => navigate("/orders")}
            >
              ← Back to Orders
            </button>
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
            ORDER DETAILS
          </span>

          <h1>
            Order #{order.id}
          </h1>

          <p>
            {new Date(
              order.created_at
            ).toLocaleString()}
          </p>

        </div>

        {/* Order Info */}
        <div className="cart-layout">

          {/* Items */}
          <div className="cart-items">

            {order.items.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >

                <div className="cart-item-image">
                  🛍️
                </div>

                <div className="cart-item-info">

                  <span className="product-category">
                    PRODUCT
                  </span>

                  <h2>
                    {item.name}
                  </h2>

                  <p>
                    {item.description}
                  </p>

                  <strong className="cart-item-price">
                    {Number(
                      item.price
                    ).toLocaleString()}{" "}
                    EGP
                  </strong>

                </div>

                <div className="cart-item-actions">

                  <div className="quantity-label">
                    Quantity
                  </div>

                  <strong>
                    {item.quantity}
                  </strong>

                  <div className="quantity-label">
                    Item Total
                  </div>

                  <strong className="item-total">
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toLocaleString()}{" "}
                    EGP
                  </strong>

                </div>

              </div>
            ))}

          </div>

          {/* Summary */}
          <aside className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Order ID
              </span>

              <strong>
                #{order.id}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Status
              </span>

              <strong>
                {order.status}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Payment
              </span>

              <strong>
                {order.payment_status}
              </strong>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                {Number(
                  order.total_amount
                ).toLocaleString()}{" "}
                EGP
              </strong>

            </div>

            <button
              className="continue-shopping"
              onClick={() => navigate("/orders")}
            >
              ← Back to Orders
            </button>

          </aside>

        </div>

      </div>
    </main>
  );
}

export default OrderDetails;
