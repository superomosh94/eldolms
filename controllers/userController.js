const User = require('../models/User')

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Fetch users failed' })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Fetch user failed' })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body
    if (updates.password) delete updates.password
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password')
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Update failed' })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Delete failed' })
  }
}