import express from 'express';
import { registerUser, loginUser, deleteMe } from '../controllers/authController.js'; // Added deleteMe here
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, (req, res) => res.json(req.user));

// This is the line that was causing the error
router.delete('/me', protect, deleteMe); 

export default router;