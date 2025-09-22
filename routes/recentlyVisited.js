const express = require('express');
const db = require('../config/database');
const auth = require('./auth');
const authenticateToken = auth.authenticateToken;

const router = express.Router();

// Get user's recently visited products
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const recentlyVisited = await db.all(
      `SELECT rv.*, p.name, p.price, p.original_price, p.stock_quantity, p.size_chart, pi.image_url
       FROM recently_visited rv
       JOIN products p ON rv.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id
       WHERE rv.user_id = ?
       GROUP BY p.id
       ORDER BY rv.visited_at DESC`,
      [req.user.userId]
    );

    // Parse size_chart to array
    recentlyVisited.forEach(item => {
      if (item.size_chart) {
        item.size_chart = item.size_chart.split(',').map(s => s.trim());
      } else {
        item.size_chart = [];
      }
    });

    res.json({ recentlyVisited });
  } catch (error) {
    next(error);
  }
});

// Add or update recently visited product
router.post('/:productId', authenticateToken, async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Insert or replace (update timestamp)
    await db.run(
      `INSERT OR REPLACE INTO recently_visited (user_id, product_id, visited_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)`,
      [req.user.userId, productId]
    );

    res.json({ message: 'Product added to recently visited' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
