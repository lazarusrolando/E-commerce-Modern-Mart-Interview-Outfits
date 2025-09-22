const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Get user cart
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const cartItems = await db.all(
      `SELECT ci.id, ci.user_id, ci.product_id, ci.quantity, ci.created_at, ci.updated_at,
              p.name as product_name, p.price as unit_price, p.stock_quantity, p.size_chart,
              b.name as brand,
              pi.image_url as product_image,
              (ci.quantity * p.price) as total_price
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN brands b ON p.brand_id = b.id
       LEFT JOIN product_images pi ON p.id = pi.product_id
       WHERE ci.user_id = ?`,
      [req.user.userId]
    );

    // Calculate summary
    const subtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);
    const discount = 0; // Placeholder for discount logic
    const shipping = subtotal > 1000 ? 0 : 50; // Example shipping logic
    const tax = 50; // Fixed tax starting with ₹50
    const total = subtotal - discount + shipping + tax;
    const free_shipping_threshold = 1000;
    const free_shipping_eligible = subtotal >= free_shipping_threshold;

    const summary = {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      free_shipping_threshold,
      free_shipping_eligible
    };

    res.json({ cart: { items: cartItems, summary } });
  } catch (error) {
    next(error);
  }
});

// Add to cart
router.post('/add', authenticateToken, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if product exists
    const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    const existingItem = await db.get(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.user.userId, productId]
    );

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      await db.run(
        'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newQuantity, existingItem.id]
      );
      res.json({ message: 'Cart item updated', updated: true });
    } else {
      // Add new item
      await db.run(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.userId, productId, quantity]
      );
      res.status(201).json({ message: 'Item added to cart', added: true });
    }
  } catch (error) {
    next(error);
  }
});

// Update cart item
router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.id;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    // Check if cart item exists and belongs to user
    const cartItem = await db.get(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
      [cartItemId, req.user.userId]
    );

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await db.run('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
      res.json({ message: 'Item removed from cart', removed: true });
    } else {
      // Update quantity
      await db.run(
        'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [quantity, cartItemId]
      );
      res.json({ message: 'Cart item updated', updated: true });
    }
  } catch (error) {
    next(error);
  }
});

// Remove from cart
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const cartItemId = req.params.id;

    // Check if cart item exists and belongs to user
    const cartItem = await db.get(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
      [cartItemId, req.user.userId]
    );

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await db.run('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
    res.json({ message: 'Item removed from cart', removed: true });
  } catch (error) {
    next(error);
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res, next) => {
  try {
    await db.run('DELETE FROM cart_items WHERE user_id = ?', [req.user.userId]);
    res.json({ message: 'Cart cleared', cleared: true });
  } catch (error) {
    next(error);
  }
});


// Get cart count
router.get('/count', authenticateToken, async (req, res, next) => {
  try {
    const countResult = await db.get(
      'SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?',
      [req.user.userId]
    );
    res.json({ count: countResult.count });
  } catch (error) {
    next(error);
  }
});

module.exports = router;