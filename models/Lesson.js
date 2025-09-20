const mongoose = require('mongoose')

const LessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content: { type: String },
  resources: [{ type: String }],
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Lesson', LessonSchema)