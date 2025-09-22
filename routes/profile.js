const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('./auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../images/avatars');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const userId = req.user.userId;
    const ext = path.extname(file.originalname);
    const filename = `avatar_${userId}_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'));
    }
  }
});

// PUT /api/profile - update user profile (protected)
router.put('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { firstName, lastName, email, phone } = req.body;

  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if email is already used by another user
    const existingUser = await db.get('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already in use by another user' });
    }

    // Update user profile
    await db.run(
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?',
      [firstName, lastName, email, phone, userId]
    );

    // Return updated profile
    const updatedUser = await db.get('SELECT id, first_name, last_name, email, phone FROM users WHERE id = ?', [userId]);
    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/profile/avatar - upload user avatar (protected)
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  const userId = req.user.userId;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the relative path for database storage
    const avatarPath = `/avatars/${req.file.filename}`;

    // Update user's avatar_url in database
    await db.run(
      'UPDATE users SET avatar_url = ? WHERE id = ?',
      [avatarPath, userId]
    );

    // Return updated user with new avatar
    const updatedUser = await db.get('SELECT id, first_name, last_name, email, phone, avatar_url FROM users WHERE id = ?', [userId]);
    res.json({ user: updatedUser, message: 'Avatar uploaded successfully' });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/profile - delete user profile (protected)
router.delete('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    // Delete user
    await db.run('DELETE FROM users WHERE id = ?', [userId]);

    // Optionally, delete related data (cart, orders, etc.) here if needed

    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
