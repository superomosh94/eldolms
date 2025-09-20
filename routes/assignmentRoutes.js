const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const { isAdminOrTeacher } = require('../middleware/roleMiddleware')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const {
  createAssignment,
  getAssignmentsByCourse,
  submitAssignment,
  gradeSubmission
} = require('../controllers/assignmentController')

router.post('/', auth, isAdminOrTeacher, createAssignment)
router.get('/course/:courseId', auth, getAssignmentsByCourse)
router.post('/submit/:assignmentId', auth, upload.single('file'), submitAssignment)
router.post('/grade/:assignmentId/:studentId', auth, isAdminOrTeacher, gradeSubmission)

module.exports = router