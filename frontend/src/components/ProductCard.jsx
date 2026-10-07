import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-image">
        💻
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category || "Uncategorized"}
        </span>

        <h2>{product.name}</h2>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-bottom">
          <div>
            <p className="product-price">
              {Number(product.price).toLocaleString()} EGP
            </p>

            <p className="product-stock">
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>
          </div>

          <button
            className="add-cart-btn"
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
