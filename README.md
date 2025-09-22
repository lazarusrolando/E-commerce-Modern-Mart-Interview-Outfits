# Modern Mart 🛍️

A modern, full-stack e-commerce platform for professional interview outfits and business attire. Built with React, Node.js, Express, and SQLite, featuring a sleek Material-UI interface and comprehensive backend API.

## ✨ Features

### 🛒 E-commerce Core
- **Product Catalog**: Browse professional clothing by categories (Men/Women, Shirts, Pants, Shoes, etc.)
- **Product Search**: Advanced search with filters and sorting options
- **Shopping Cart**: Add, remove, and manage items with real-time updates
- **Wishlist**: Save favorite items for later
- **Order Management**: Complete checkout process with order tracking

### 👤 User Management
- **User Authentication**: Secure login/registration with JWT tokens
- **Profile Management**: User profiles with avatar upload functionality
- **Password Security**: Encrypted passwords with bcrypt
- **Session Management**: Persistent user sessions

### 💳 Payment & Orders
- **Payment Integration**: Razorpay payment gateway integration
- **Order Processing**: Complete order lifecycle management
- **Order History**: View past orders and track status
- **Invoice Generation**: Order confirmations and receipts

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Material-UI Components**: Modern, accessible UI components
- **Smooth Animations**: Enhanced user experience with CSS animations
- **Image Optimization**: Optimized product images with lazy loading

### 🔧 Admin Features
- **Dashboard**: Comprehensive admin dashboard for store management
- **Product Management**: Add, edit, and manage product inventory
- **Category Management**: Organize products by categories
- **Order Management**: Process and track customer orders
- **User Management**: Admin panel for user administration

### 🤖 Additional Features
- **AI Chatbot**: Integrated chatbot for customer support
- **Review System**: Product reviews and ratings
- **Recently Visited**: Track and display recently viewed products
- **Contact Forms**: Customer inquiry and support forms
- **Blog System**: Content management for store blog
- **Newsletter**: Email subscription functionality

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **Material-UI (MUI)** - React components implementing Google's Material Design
- **React Router** - Declarative routing for React applications
- **React Query** - Powerful data synchronization for React
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications
- **React Slick** - Carousel component for product sliders

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web application framework for Node.js
- **SQLite** - Lightweight, file-based database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - Middleware for handling file uploads
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting middleware

### Development Tools
- **Nodemon** - Automatic server restart during development
- **ESLint** - JavaScript linting
- **React Scripts** - Build scripts for React applications

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd modern-mart
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:3000
   API_URL=http://localhost:5000/api
   ```

4. **Database Setup**
   ```bash
   npm run init-db
   npm run seed
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend development server**
   ```bash
   npm start
   ```

3. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search` - Search products

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

### Payment Endpoints
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment

## 📁 Project Structure

```
modern-mart/
├── backend/                    # Backend API server
│   ├── config/                # Database configuration
│   ├── routes/                # API route handlers
│   ├── scripts/               # Database scripts
│   ├── images/                # Static image files
│   └── server.js              # Main server file
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── styles/            # CSS and styling files
│   │   └── App.js             # Main App component
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── database/                  # SQLite database files
├── README.md                  # Project documentation
└── package.json               # Root dependencies
```

## 🎯 Usage

### For Customers
1. **Browse Products**: Explore the catalog by categories or use search
2. **Create Account**: Register for personalized experience
3. **Add to Cart**: Select items and add them to your cart
4. **Checkout**: Complete your purchase with secure payment
5. **Track Orders**: Monitor your order status and history

### For Administrators
1. **Access Dashboard**: Login with admin credentials
2. **Manage Products**: Add, edit, or remove products
3. **Process Orders**: Update order statuses and manage fulfillment
4. **View Analytics**: Monitor sales and customer data

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for passwords
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin requests
- **Helmet Security**: Security headers for Express
- **Input Validation**: Comprehensive input sanitization
- **File Upload Security**: Secure file handling with validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI** for the beautiful component library
- **React** for the powerful frontend framework
- **Express.js** for the robust backend framework
- **SQLite** for the lightweight database solution
- **Razorpay** for payment processing
- **Google Generative AI** for chatbot functionality

## 📞 Support

For support, create an issue in the repository.

## 🔄 Recent Updates

### Avatar Upload Feature ✅
- Added avatar upload functionality to user profiles
- Implemented secure file handling with validation
- Added real-time image preview
- Enhanced profile management UI

### Performance Optimizations
- Optimized database queries
- Implemented lazy loading for images
- Added caching for frequently accessed data
- Improved API response times

---

**Modern Mart** - Your destination for professional interview outfits and business attire. Dress for success! 👔👗
