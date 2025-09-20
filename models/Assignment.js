const mongoose = require('mongoose')

const AssignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      fileUrl: { type: String },
      marks: { type: Number },
      submittedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Assignment', AssignmentSchema)