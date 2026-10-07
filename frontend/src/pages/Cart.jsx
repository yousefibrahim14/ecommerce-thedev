import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  const handleCheckout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <span className="eyebrow">SHOPPING CART</span>

            <h1>Your Cart</h1>

            <p>Your cart is currently empty.</p>
          </div>

          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>

            <h2>Your cart is empty</h2>

            <p>Add some products to your cart and come back here.</p>

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

        {/* Header */}
        <div className="cart-header">
          <span className="eyebrow">SHOPPING CART</span>

          <h1>Your Cart</h1>

          <p>Review your items before checkout.</p>

          <span className="cart-count">
            {cartItems.length}{" "}
            {cartItems.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        <div className="cart-layout">

          {/* Cart Items */}
          <div className="cart-items">

            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>

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
                    {Number(item.price).toLocaleString()} EGP
                  </strong>

                </div>

                <div className="cart-item-actions">

                  <div className="quantity-label">
                    Quantity
                  </div>

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <strong className="item-total">
                    {(
                      Number(item.price) * item.quantity
                    ).toLocaleString()}{" "}
                    EGP
                  </strong>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* Order Summary */}
          <aside className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <strong>
                {cartTotal.toLocaleString()} EGP
              </strong>
            </div>

            <div className="summary-row">
              <span>Shipping</span>

              <strong>Free</strong>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>

              <strong>
                {cartTotal.toLocaleString()} EGP
              </strong>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout →
            </button>

            <button
              className="continue-shopping"
              onClick={() => navigate("/")}
            >
              ← Continue Shopping
            </button>

          </aside>

        </div>
      </div>
    </main>
  );
}

export default Cart;
