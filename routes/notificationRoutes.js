const express = require('express')
const router = express.Router()
const auth = require('../middleware/authMiddleware')
const { isAdminOrTeacher } = require('../middleware/roleMiddleware')
const {
  createNotification,
  getNotifications,
  deleteNotification
} = require('../controllers/notificationController')

router.post('/', auth, isAdminOrTeacher, createNotification)
router.get('/', auth, getNotifications)
router.delete('/:id', auth, isAdminOrTeacher, deleteNotification)

module.exports = router