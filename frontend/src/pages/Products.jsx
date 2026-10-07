import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="page-message">
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-message error">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">WELCOME TO E-SHOP</span>

          <h1>
            Shop Smarter.
            <br />
            <span>Live Better.</span>
          </h1>

          <p>
            Discover quality products at great prices.
            Everything you need, all in one place.
          </p>

          <a href="#products" className="hero-btn">
            Explore Products ↓
          </a>
        </div>

        <div className="hero-icon">
          🛍️
        </div>
      </section>

      {/* Products */}
      <section id="products" className="products-page">
        <div className="products-header">
          <div>
            <p className="eyebrow">OUR STORE</p>
            <h2>Discover Our Products</h2>
            <p>
              Find the best products at great prices.
            </p>
          </div>

          <span className="products-count">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* Search */}
        <div className="search-wrapper">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="categories">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="page-message">
            <h2>No products found</h2>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;
