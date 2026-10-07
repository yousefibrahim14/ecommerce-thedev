const pool = require("../db");

// ==========================================
// Create Order
// ==========================================
const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: "ERROR",
        message: "Order items are required"
      });
    }

    await client.query("BEGIN");

    let totalAmount = 0;
    const orderItems = [];

    // ==========================================
    // Validate products and calculate total
    // ==========================================
    for (const item of items) {
      const { product_id, quantity } = item;

      if (!product_id || !quantity || quantity <= 0) {
        throw new Error("Invalid product or quantity");
      }

      const productResult = await client.query(
        `
        SELECT id, name, price, stock
        FROM products
        WHERE id = $1
        FOR UPDATE
        `,
        [product_id]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product ${product_id} not found`);
      }

      const product = productResult.rows[0];

      if (product.stock < quantity) {
        throw new Error(
          `Insufficient stock for product: ${product.name}`
        );
      }

      const itemPrice = Number(product.price);
      const itemTotal = itemPrice * quantity;

      totalAmount += itemTotal;

      orderItems.push({
        product_id: product.id,
        quantity,
        price: itemPrice
      });
    }

    // ==========================================
    // Create Order
    // ==========================================
    const orderResult = await client.query(
      `
      INSERT INTO orders
        (user_id, total_amount, status, payment_status)
      VALUES
        ($1, $2, 'pending', 'pending')
      RETURNING
        id,
        user_id,
        total_amount,
        status,
        payment_status,
        created_at
      `,
      [userId, totalAmount]
    );

    const order = orderResult.rows[0];

    // ==========================================
    // Create Order Items
    // ==========================================
    for (const item of orderItems) {
      await client.query(
        `
        INSERT INTO order_items
          (order_id, product_id, quantity, price)
        VALUES
          ($1, $2, $3, $4)
        `,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.price
        ]
      );

      // ==========================================
      // Update Product Stock
      // ==========================================
      await client.query(
        `
        UPDATE products
        SET stock = stock - $1
        WHERE id = $2
        `,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      status: "OK",
      message: "Order created successfully",
      order
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Create order error:", error);

    res.status(400).json({
      status: "ERROR",
      message: error.message || "Failed to create order"
    });

  } finally {
    client.release();
  }
};


// ==========================================
// Get My Orders
// ==========================================
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        total_amount,
        status,
        payment_status,
        created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.status(200).json({
      status: "OK",
      orders: result.rows
    });

  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Failed to get orders"
    });
  }
};


// ==========================================
// Get Order Details
// ==========================================
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const orderResult = await pool.query(
      `
      SELECT
        o.id,
        o.user_id,
        o.total_amount,
        o.status,
        o.payment_status,
        o.created_at
      FROM orders o
      WHERE o.id = $1
        AND o.user_id = $2
      `,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        status: "ERROR",
        message: "Order not found"
      });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `
      SELECT
        oi.id,
        oi.product_id,
        p.name,
        p.description,
        oi.quantity,
        oi.price
      FROM order_items oi
      JOIN products p
        ON p.id = oi.product_id
      WHERE oi.order_id = $1
      ORDER BY oi.id
      `,
      [orderId]
    );

    res.status(200).json({
      status: "OK",
      order: {
        ...order,
        items: itemsResult.rows
      }
    });

  } catch (error) {
    console.error("Get order details error:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Failed to get order details"
    });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};
