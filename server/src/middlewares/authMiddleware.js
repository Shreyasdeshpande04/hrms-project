import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Safety check for empty strings
      if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({ message: 'Not authorized, no token' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      
      // CRITICAL FIX: If token is valid but user no longer exists in DB
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user no longer exists' });
      }

      next();
    } catch (error) {
      console.error("JWT Error:", error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};