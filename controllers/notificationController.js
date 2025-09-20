const Notification = require('../models/Notification')

exports.createNotification = async (req, res) => {
  try {
    const { title, message, targetRoles } = req.body
    
    if (!title || !message || !targetRoles) {
      return res.status(400).json({ message: 'Please provide title, message, and target roles' })
    }
    
    const payload = { ...req.body, createdBy: req.user.id }
    const note = await Notification.create(payload)
    res.status(201).json(note)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Create notification failed' })
  }
}

exports.getNotifications = async (req, res) => {
  try {
    // Only show notifications for the user's role
    const notes = await Notification.find({
      targetRoles: req.user.role
    }).populate('createdBy', 'name')
    res.json(notes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Fetch notifications failed' })
  }
}

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id)
    res.json({ message: 'Notification deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Delete failed' })
  }
}
