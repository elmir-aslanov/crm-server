import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { protect, authorizeRoles } from '../middlewares/autenticationMiddleware.js';

const router = express.Router();

router.get('/stats', protect, authorizeRoles('Admin', 'Manager', 'Accountant'), getDashboardStats);

export default router;