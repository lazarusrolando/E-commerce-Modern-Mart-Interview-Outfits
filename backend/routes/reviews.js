const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Get reviews for a product by product slug
router.get('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const product = await db.get('SELECT id FROM products WHERE slug = ?', [slug]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const reviews = await db.all(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.first_name, u.last_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [product.id]
    );
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

// Submit a new review for a product by product slug
router.post('/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const { user_id, rating, comment } = req.body;

    if (!user_id || !rating) {
      return res.status(400).json({ error: 'user_id and rating are required' });
    }

    const product = await db.get('SELECT id FROM products WHERE slug = ?', [slug]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const result = await db.run(
      `INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)`,
      [product.id, user_id, rating, comment || null]
    );

    res.status(201).json({ message: 'Review submitted successfully', reviewId: result.lastID });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
