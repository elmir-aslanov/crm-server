import express from 'express';
import { loginUser, me, refreshToken, registerUser } from '../controllers/authController.js';
import { protect } from '../middlewares/authenticationMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { loginSchema, registerSchema } from '../validations/authValidation.js';

const router = express.Router();
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', protect, refreshToken);
router.get('/me', protect, me);
export default router;