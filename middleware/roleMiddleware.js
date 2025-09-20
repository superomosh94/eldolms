exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' })
  next()
}

exports.isAdminOrTeacher = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'teacher') return next()
  return res.status(403).json({ message: 'Forbidden' })
}