const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization; // support both

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: only hit DB if you need full user info
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach to request for later use
    req.user = { id: user._id, role: user.role };

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};
