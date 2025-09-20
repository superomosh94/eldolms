// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

// ✅ Add course (admin only) - static route before dynamic :id
router.post('/create', auth, isAdmin, createCourse);

// ✅ Get all courses
router.get('/', auth, getCourses);

// ✅ Get single course
router.get('/:id', auth, getCourse);

// ✅ Update course (admin only)
router.put('/:id', auth, isAdmin, updateCourse);

// ✅ Delete course (admin only)
router.delete('/:id', auth, isAdmin, deleteCourse);

module.exports = router;
