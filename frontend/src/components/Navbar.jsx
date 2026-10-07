import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="logo">
          🛒 <span>E-Shop</span>
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">

          <Link to="/">Products</Link>

          <Link to="/cart" className="cart-link">
            🛒 Cart

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Authentication */}
          {user ? (
            <>
              {/* My Orders */}
              <Link to="/orders" className="orders-link">
                📦 My Orders
              </Link>

              {/* User */}
              <span className="user-name">
                👤 {user.name}
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
