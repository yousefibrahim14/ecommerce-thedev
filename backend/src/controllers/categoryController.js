const pool = require("../db");

// Get all categories
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, created_at
      FROM categories
      ORDER BY id;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch categories"
    });
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "ERROR",
        message: "Category name is required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING *;
      `,
      [name]
    );

    res.status(201).json({
      status: "OK",
      category: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating category:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Failed to create category"
    });
  }
};

module.exports = {
  getCategories,
  createCategory
};
