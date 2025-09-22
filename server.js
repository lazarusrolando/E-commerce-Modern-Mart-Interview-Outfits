require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const db = require('./config/database');

// Import route modules
const { router: authRoutes } = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const categoriesRoutes = require('./routes/categories');
const chatbotRoutes = require('./routes/chatbot');
const contactRoutes = require('./routes/contact');
const loginRoutes = require('./routes/login');
const ordersRoutes = require('./routes/orders');
const paymentsRoutes = require('./routes/payments');
const productsRoutes = require('./routes/products');
const profileRoutes = require('./routes/profile');
const recentlyVisitedRoutes = require('./routes/recentlyVisited');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');
const wishlistRoutes = require('./routes/wishlist');

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   methods: 'GET',
//   optionsSuccessStatus: 200
// };

// Middleware
app.use(helmet());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/database/images', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, '../database/images')));

app.use('/api/images', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, '../database/images')));

// Serve avatar images
app.use('/api/avatars', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, 'images/avatars')));

// Also serve from /avatars for backward compatibility
app.use('/avatars', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, 'images/avatars')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/recently-visited', recentlyVisitedRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/wishlist', wishlistRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the Modern Mart API');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Modern Mart API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('/', (req, res) => {
  console.log(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);

  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await db.connect();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🔗 API URL: ${process.env.API_URL || 'http://localhost:5000/api'}`)
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
  try {
    await db.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Gracefully shutting down...');
  try {
    await db.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();
