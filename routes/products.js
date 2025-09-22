const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all products with filters
router.get('/', async (req, res, next) => {
  try {
    // Validate and sanitize query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'DESC';

    // Validate numeric parameters
    const validPage = Math.max(1, isNaN(page) ? 1 : page);
    const validLimit = Math.max(1, Math.min(100, isNaN(limit) ? 12 : limit)); // Max 100 items per page

    const {
      search,
      category,
      brand,
      discount,
      featured
    } = req.query;

    let whereClause = '1=1';
    let params = [];
    let joins = `
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
    `;

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      whereClause += ' AND c.name = ?';
      params.push(category);
    }

    if (brand) {
      whereClause += ' AND b.name = ?';
      params.push(brand);
    }

    if (discount === 'true') {
      whereClause += ' AND p.discount_percentage > 0';
    }

    if (featured === 'true') {
      whereClause += ' AND p.featured = 1';
    }

    // Sorting
    let orderBy = 'p.created_at DESC';
    if (sortBy === 'price') {
      orderBy = 'p.price ASC';
    } else if (sortBy === 'price_desc') {
      orderBy = 'p.price DESC';
    } else if (sortBy === 'name') {
      orderBy = 'p.name ASC';
    } else if (sortBy === 'rating') {
      orderBy = 'p.average_rating DESC';
    }

    if (sortOrder === 'ASC') {
      orderBy = orderBy.replace('DESC', 'ASC');
    }

    // Pagination
    const offset = (validPage - 1) * validLimit;

    // Construct the query dynamically
    const products = await db.all(`
      SELECT p.*, pi.image_url AS primary_image
      FROM products p
      ${joins}
      WHERE ${whereClause}
      GROUP BY p.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `, [...params, validLimit, offset]);

    // Calculate discount percentage for each product
    products.forEach(product => {
      if (product.original_price && product.original_price > 0) {
        product.discount_percentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
      } else {
        product.discount_percentage = 0;
      }
    });

    // For each product, get average rating and review count
    for (const product of products) {
      const ratingData = await db.get(`
        SELECT 
          AVG(rating) AS average_rating,
          COUNT(*) AS review_count
        FROM reviews
        WHERE product_id = ?
      `, [product.id]);
      product.average_rating = ratingData.average_rating ? parseFloat(ratingData.average_rating.toFixed(2)) : 0;
      product.review_count = ratingData.review_count || 0;
    }

    // Get total count for pagination
    const totalResult = await db.get(`
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      ${joins}
      WHERE ${whereClause}
    `, params);

    const total = totalResult.total;
    const totalPages = Math.ceil(total / validLimit);

    // Add size_chart parsing to array if stored as comma separated string
    products.forEach(product => {
      if (product.size_chart) {
        product.size_chart = product.size_chart.split(',').map(s => s.trim());
      } else {
        product.size_chart = [];
      }
    });

    // Get filter options
    const categories = await db.all('SELECT DISTINCT name FROM categories');
    const brands = await db.all('SELECT DISTINCT name FROM brands');
    const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl']; // Fixed sizes

    const filters = {
      categories: categories.map(c => c.name),
      brands: brands.map(b => b.name),
      sizes: sizes,
      discount: true,
      featured: true
    };

    const pagination = {
      currentPage: validPage,
      totalPages,
      totalItems: total,
      itemsPerPage: validLimit
    };

    res.json({ products, filters, pagination });
    req.json = { products, filters, pagination }; // For testing purposes
  } catch (error) {
    next(error);
  }
});

// Get all products (alternative route for frontend compatibility)
router.get('/all', async (req, res, next) => {
  try {
    const products = await db.all(`
      SELECT p.*, pi.image_url
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
    `);

    // Calculate discount percentage for each product
    products.forEach(product => {
      if (product.original_price && product.original_price > 0) {
        product.discount_percentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
      } else {
        product.discount_percentage = 0;
      }

      // Add size_chart parsing to array if stored as comma separated string
      if (product.size_chart) {
        product.size_chart = product.size_chart.split(',').map(s => s.trim());
      } else {
        product.size_chart = [];
      }
    });

    res.json({ products });
    req.json = products; // For testing purposes
  } catch (error) {
    next(error);
  }
});

// Get product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
    req.json = product; // For testing purposes
  } catch (error) {
    next(error);
  }
});

// Get product by slug
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const product = await db.get(`
      SELECT p.*, pi.image_url AS primary_image, c.name AS category_name
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `, [req.params.slug]);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (product.size_chart) {
      product.size_chart = product.size_chart.split(',').map(s => s.trim());
    } else {
      product.size_chart = [];
    }

    // Calculate discount percentage
    if (product.original_price && product.original_price > 0) {
      product.discount_percentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
    } else {
      product.discount_percentage = 0;
    }

    // Get average rating and review count
    const ratingData = await db.get(`
      SELECT
        AVG(rating) AS average_rating,
        COUNT(*) AS review_count
      FROM reviews
      WHERE product_id = ?
    `, [product.id]);

    product.average_rating = ratingData.average_rating ? parseFloat(ratingData.average_rating.toFixed(2)) : 0;
    product.review_count = ratingData.review_count || 0;

    res.json({ product });
    req.json = product; // For testing purposes
  } catch (error) {
    next(error);
  }
});

// Get products by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const category = req.params.category;
    const products = await db.all(
      `SELECT p.* FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE c.name = ?`,
      [category]
    );

    // Calculate discount percentage for each product
    products.forEach(product => {
      if (product.original_price && product.original_price > 0) {
        product.discount_percentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
      } else {
        product.discount_percentage = 0;
      }
    });

    res.json({ products });
    req.json = products; // For testing purposes
  } catch (error) {
    next(error);
  }
});

// Search products
router.get('/search', async (req, res, next) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const products = await db.all(
      `SELECT * FROM products WHERE name LIKE ? OR description LIKE ?`,
      [`%${q}%`, `%${q}%`]
    );

    // Calculate discount percentage for each product
    products.forEach(product => {
      if (product.original_price && product.original_price > 0) {
        product.discount_percentage = Math.round(((product.original_price - product.price) / product.original_price) * 100);
      } else {
        product.discount_percentage = 0;
      }
    });

    res.json({ products });
    req.json = products; // For testing purposes
  } catch (error) {
    next(error);
  }
});

module.exports = router;
