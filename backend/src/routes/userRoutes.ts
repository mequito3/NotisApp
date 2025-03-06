import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserPreferences } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Rutas públicas
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rutas protegidas
router.get('/profile', protect, getUserProfile);
router.put('/preferences', protect, updateUserPreferences);

export default router; 