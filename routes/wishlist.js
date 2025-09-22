const express = require('express');
const db = require('../config/database');
const auth = require('./auth');
const authenticateToken = auth.authenticateToken;

const router = express.Router();

// Get user wishlist
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const wishlistItems = await db.all(
      `SELECT w.*, p.name, p.price, p.stock_quantity
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?`,
      [req.user.userId]
    );
    res.json({ wishlist: wishlistItems });
  } catch (error) {
    next(error);
  }
});

// Toggle wishlist (add or remove)
router.post('/toggle/:productId', authenticateToken, async (req, res, next) => {
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

    // Check if item already in wishlist
    const existingItem = await db.get(
      'SELECT * FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [req.user.userId, productId]
    );

    if (existingItem) {
      // Remove from wishlist
      await db.run(
        'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
        [req.user.userId, productId]
      );
      res.json({ message: 'Item removed from wishlist', removed: true });
    } else {
      // Add to wishlist
      await db.run(
        'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
        [req.user.userId, productId]
      );
      res.json({ message: 'Item added to wishlist', added: true });
    }
  } catch (error) {
    next(error);
  }
});

// Add to wishlist
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in wishlist
    const existingItem = await db.get(
      'SELECT * FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [req.user.userId, productId]
    );

    if (existingItem) {
      return res.status(409).json({ error: 'Item already in wishlist' });
    }

    // Add to wishlist
    await db.run(
      'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
      [req.user.userId, productId]
    );
    res.status(201).json({ message: 'Item added to wishlist', added: true });
  } catch (error) {
    next(error);
  }
});

// Remove from wishlist
router.delete('/:productId', authenticateToken, async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check if item exists in wishlist
    const wishlistItem = await db.get(
      'SELECT * FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [req.user.userId, productId]
    );

    if (!wishlistItem) {
      return res.status(404).json({ error: 'Item not in wishlist' });
    }

    await db.run(
      'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
      [req.user.userId, productId]
    );
    res.json({ message: 'Item removed from wishlist', removed: true });
  } catch (error) {
    next(error);
  }
});

// Clear wishlist
router.delete('/', authenticateToken, async (req, res, next) => {
  try {
    await db.run('DELETE FROM wishlist_items WHERE user_id = ?', [req.user.userId]);
    res.json({ message: 'Wishlist cleared', cleared: true });
  } catch (error) {
    next(error);
  }
});


// Get wishlist count
router.get('/count', authenticateToken, async (req, res, next) => {
  try {
    const countResult = await db.get(
      'SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?',
      [req.user.userId]
    );
    res.json({ count: countResult.count });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
