import express from 'express';
import { getAttendanceReport, getGroupFillRateReport, getLeadSourceReport, getMonthlyRevenueReport } from '../controllers/reportController.js';
import { protect, authorizeRoles } from '../middlewares/autenticationMiddleware.js';

const router = express.Router();

router.get('/leads/source', protect, authorizeRoles('Admin', 'Manager'), getLeadSourceReport);
router.get('/revenue/monthly', protect, authorizeRoles('Admin', 'Manager', 'Accountant'), getMonthlyRevenueReport);
router.get('/groups/fill-rate', protect, authorizeRoles('Admin', 'Manager'), getGroupFillRateReport);
router.get('/attendance', protect, authorizeRoles('Admin', 'Manager', 'Teacher'), getAttendanceReport);

export default router;