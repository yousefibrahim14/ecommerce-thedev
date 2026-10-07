const pool = require("../db");

// ==========================================
// Get All Products
// ==========================================
const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        c.name AS category,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      ORDER BY p.id;
    `);

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch products"
    });
  }
};


// ==========================================
// Get Product By ID
// ==========================================
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        c.name AS category,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      WHERE p.id = $1;
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "ERROR",
        message: "Product not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch product"
    });
  }
};


// ==========================================
// Create Product
// ==========================================
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category_id
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        status: "ERROR",
        message: "Name and price are required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO products
        (name, description, price, stock, category_id)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [
        name,
        description || null,
        price,
        stock || 0,
        category_id || null
      ]
    );

    res.status(201).json({
      status: "OK",
      product: result.rows[0]
    });

  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Failed to create product"
    });
  }
};


// ==========================================
// Update Product
// ==========================================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      stock,
      category_id
    } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        stock = COALESCE($4, stock),
        category_id = COALESCE($5, category_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
      `,
      [
        name,
        description,
        price,
        stock,
        category_id,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "ERROR",
        message: "Product not found"
      });
    }

    res.status(200).json({
      status: "OK",
      product: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Failed to update product"
    });
  }
};


// ==========================================
// Export Controllers
// ==========================================
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct
};
