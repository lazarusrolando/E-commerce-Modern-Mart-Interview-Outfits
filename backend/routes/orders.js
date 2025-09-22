const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get user orders
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const orders = await db.all(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.userId]
    );
    res.json({ orders });
  } catch (error) {
    next(error);
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const order = await db.get(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.userId]
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderItems = await db.all(
      `SELECT oi.*, p.name, p.price FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );

    res.json({ order, items: orderItems });
  } catch (error) {
    next(error);
  }
});

// Create order
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    // Start transaction
    await db.run('BEGIN TRANSACTION');

    // Insert order
    const result = await db.run(
      `INSERT INTO orders (user_id, shipping_address, payment_method, status, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [req.user.userId, shippingAddress, paymentMethod, 'Pending']
    );

    const orderId = result.id;

    // Insert order items
    for (const item of items) {
      const { productId, quantity, price } = item;
      await db.run(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, productId, quantity, price]
      );
    }

    // Commit transaction
    await db.run('COMMIT');

    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    await db.run('ROLLBACK');
    next(error);
  }
});

module.exports = router;
