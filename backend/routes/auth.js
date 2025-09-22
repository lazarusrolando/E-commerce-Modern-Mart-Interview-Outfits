const express = require('express');
const router = express.Router();
const db = require('../config/database');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Middleware to authenticate token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    // Verify token from tokens table
    const tokenRecord = await db.get('SELECT user_id, expires_at FROM tokens WHERE token = ?', [token]);
    if (!tokenRecord) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    if (new Date(tokenRecord.expires_at) < new Date()) {
      return res.status(403).json({ message: 'Token expired' });
    }
    req.user = { userId: tokenRecord.user_id };
    next();
  } catch (error) {
    console.error('Error authenticating token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to generate OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/register - create new user and store plain password (no hashing)
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !lastName || !email || !phone || !password) {
    console.error('Registration error: Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      console.error(`Registration error: User with email ${email} already exists`);
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Insert new user into database with plain password
    const result = await db.run(
      'INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone, password]
    );

    // Log the plain password at creation time
    console.log(`New user registered: ${email} with password: ${password}`);

    // Generate a simple token (for demo purposes, use JWT or similar in production)
    const token = crypto.randomBytes(32).toString('hex');

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/login - verify password and send OTP to email (temporarily log to console)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if user exists
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password by direct comparison (no hashing)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate OTP and expiry (5 minutes)
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store OTP in otps table
    await db.run(
      'INSERT INTO otps (user_id, otp_code, expires_at) VALUES (?, ?, ?)',
      [user.id, otp, expiresAt]
    );

    // Temporarily log OTP to console
    console.log(`OTP for ${email}: ${otp}`);

    res.json({ message: 'OTP sent to email (check server console)' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/verify-otp - verify OTP and return token
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    // Get user
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get latest OTP for user
    const otpRecord = await db.get(
      'SELECT * FROM otps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [user.id]
    );

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
    }

    // Check OTP expiry
    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // Check OTP match
    if (otpRecord.otp_code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Generate random token and store in tokens table with expiry (24h)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db.run(
      'INSERT INTO tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt]
    );

    res.json({ token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// GET /api/auth/profile - get user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.get('SELECT id, first_name, last_name, email, phone, created_at FROM users WHERE id = ?', [req.user.userId]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = { router, authenticateToken };
