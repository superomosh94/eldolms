const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust path
require('dotenv').config();
const connectDB = require('./config/db');

connectDB();

async function createAdmin() {
  const existing = await User.findOne({ email: 'admin@example.com' });
  if (existing) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashed = await bcrypt.hash('admin123', 10);

  const admin = new User({
    name: 'Admin',
    email: 'admin@example.com',
    password: hashed,
    role: 'admin'
  });

  await admin.save();
  console.log('Admin user created');
  process.exit();
}

createAdmin();

