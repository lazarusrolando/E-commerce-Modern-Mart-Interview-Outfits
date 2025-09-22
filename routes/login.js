const express = require('express');
const router = express.Router();
const db = require('../config/database');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Helper function to generate OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/login - verify password and send OTP to email
router.post('/', async (req, res) => {
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

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
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

// POST /api/login/verify-otp - verify OTP and return token
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

    // Generate a simple token (for demo purposes, use JWT or similar in production)
    const token = crypto.randomBytes(32).toString('hex');

    res.json({ token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
