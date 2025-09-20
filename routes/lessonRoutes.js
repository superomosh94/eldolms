const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const { isAdminOrTeacher } = require('../middleware/roleMiddleware')
const {
  createLesson,
  getLessonsByCourse,
  getLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController')

router.post('/', auth, isAdminOrTeacher, createLesson)
router.get('/course/:courseId', auth, getLessonsByCourse)
router.get('/:id', auth, getLesson)
router.put('/:id', auth, isAdminOrTeacher, updateLesson)
router.delete('/:id', auth, isAdminOrTeacher, deleteLesson)

module.exports = router