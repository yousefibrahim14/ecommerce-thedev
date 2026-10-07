import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const items = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      clearCart();

      navigate("/");

    } catch (error) {
      console.error("Checkout error:", error);

      setError(
        error.message || "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <span className="eyebrow">
              CHECKOUT
            </span>

            <h1>Your Cart is Empty</h1>

            <p>
              Add some products before checking out.
            </p>
          </div>

          <div className="empty-cart">
            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>No items to checkout</h2>

            <button
              className="checkout-btn"
              onClick={() => navigate("/")}
            >
              Start Shopping →
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">

        <div className="cart-header">
          <span className="eyebrow">
            CHECKOUT
          </span>

          <h1>Checkout</h1>

          <p>
            Review your order before placing it.
          </p>
        </div>

        <div className="cart-layout">

          <div className="cart-items">

            {cartItems.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >

                <div className="cart-item-image">
                  🛍️
                </div>

                <div className="cart-item-info">

                  <span className="product-category">
                    {item.category || "PRODUCT"}
                  </span>

                  <h2>{item.name}</h2>

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

          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>

              <strong>
                {cartItems.length}
              </strong>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                {cartTotal.toLocaleString()} EGP
              </strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>

              <strong>
                Free
              </strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                {cartTotal.toLocaleString()} EGP
              </strong>
            </div>

            {error && (
              <div
                style={{
                  color: "#dc2626",
                  background: "#fee2e2",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "16px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <button
              className="checkout-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : "Place Order →"}
            </button>

            <button
              className="continue-shopping"
              onClick={() => navigate("/cart")}
              disabled={loading}
            >
              ← Back to Cart
            </button>

          </aside>

        </div>
      </div>
    </main>
  );
}

export default Checkout;
