import express from 'express';
import { registerUser, loginUser, me, refreshToken } from '../controllers/authController.js';
import { protect } from '../middlewares/autenticationMiddleware.js';


const router = express.Router();
router.post('/register',registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, me);
export default router;