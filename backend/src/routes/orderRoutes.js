const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById
} = require("../controllers/orderController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new order
router.post("/", authenticateToken, createOrder);

// Get logged-in user's orders
router.get("/my-orders", authenticateToken, getMyOrders);

// Get order details
router.get("/:id", authenticateToken, getOrderById);

module.exports = router;
