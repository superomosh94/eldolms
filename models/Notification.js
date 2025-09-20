const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  targetRoles: [{ type: String, enum: ['admin', 'teacher', 'student'] }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Notification', NotificationSchema)