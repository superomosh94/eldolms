const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // your User model
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// All routes are protected and require admin role
router.get('/', auth, isAdmin, getUsers);
router.get('/:id', auth, isAdmin, getUserById);
router.put('/:id', auth, isAdmin, updateUser);
router.delete('/:id', auth, isAdmin, deleteUser);

// ---------- NEW ROUTE TO ADD USER ----------
router.post('/add', auth, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
