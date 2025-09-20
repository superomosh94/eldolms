const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  materials: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Course', CourseSchema)