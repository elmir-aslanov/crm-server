import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser, getMe, refreshToken } from '../controllers/authController.js';
import { protect } from '../middlewares/authenticationMiddleware.js';

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX || 10),
    message: { message: 'Too many attempts, please try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);

export default router;