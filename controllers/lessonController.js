const Lesson = require('../models/Lesson')

exports.createLesson = async (req, res) => {
  try {
    const { course, title, content, resources, order } = req.body
    
    if (!course || !title) {
      return res.status(400).json({ message: 'Please provide course and title' })
    }
    
    const lesson = await Lesson.create(req.body)
    res.status(201).json(lesson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Create lesson failed' })
  }
}

exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId }).sort('order')
    res.json(lessons)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Fetch lessons failed' })
  }
}

exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course')
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' })
    res.json(lesson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Fetch lesson failed' })
  }
}

exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(lesson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Update lesson failed' })
  }
}

exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id)
    res.json({ message: 'Lesson deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Delete lesson failed' })
  }
}