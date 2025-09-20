const bcrypt = require('bcrypt')
const User = require('../models/User')
const generateToken = require('../utils/generateToken');


exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }
    
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already exists' })

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const user = await User.create({ name, email, password: hashed, role })
    const token = generateToken(user._id)

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Registration failed' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }
    
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const token = generateToken(user._id)
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Login failed' })
  }
}

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Fetch failed' })
  }
}