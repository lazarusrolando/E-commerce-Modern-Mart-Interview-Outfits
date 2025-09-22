const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// GET /api/users/stats - get user statistics
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Total spent by user
    const totalSpentRow = await db.get(
      `SELECT SUM(oi.price * oi.quantity) AS total_spent
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?`,
      [userId]
    );
    const totalSpent = totalSpentRow?.total_spent || 0;

    // Average order value
    const avgOrderRow = await db.get(
      `SELECT AVG(total) AS average_order_value FROM (
         SELECT SUM(oi.price * oi.quantity) AS total
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         WHERE o.user_id = ?
         GROUP BY o.id
       )`,
      [userId]
    );
    const averageOrderValue = avgOrderRow?.average_order_value || 0;

    // Favorite category by total spent
    const favCategoryRow = await db.get(
      `SELECT c.name AS favorite_category
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       JOIN categories c ON p.category_id = c.id
       WHERE o.user_id = ?
       GROUP BY c.id
       ORDER BY SUM(oi.price * oi.quantity) DESC
       LIMIT 1`,
      [userId]
    );
    const favoriteCategory = favCategoryRow?.favorite_category || null;

    // Last order date
    const lastOrderRow = await db.get(
      `SELECT MAX(created_at) AS last_order_date FROM orders WHERE user_id = ?`,
      [userId]
    );
    const lastOrderDate = lastOrderRow?.last_order_date || null;

    res.json({
      total_spent: totalSpent,
      average_order_value: averageOrderValue,
      favorite_category: favoriteCategory,
      last_order_date: lastOrderDate
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
