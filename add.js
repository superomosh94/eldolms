require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('./models/User')
const connectDB = require('./config/db')

// Connect to DB
connectDB()

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany()
    console.log('Existing users removed')

    // Create admin
    const adminPassword = await bcrypt.hash('Admin@123', 10)
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    })

    // Create other users
    const users = []
    for (let i = 1; i <= 9; i++) {
      const role = i % 2 === 0 ? 'teacher' : 'student'
      const hashedPassword = await bcrypt.hash(`Password${i}`, 10)
      users.push(
        new User({
          name: `${role.charAt(0).toUpperCase() + role.slice(1)} ${i}`,
          email: `${role}${i}@example.com`,
          password: hashedPassword,
          role
        })
      )
    }

    await admin.save()
    await User.insertMany(users)

    console.log('10 users seeded successfully')
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seedUsers()
