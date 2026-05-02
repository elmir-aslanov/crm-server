import express from 'express';
import { bulkMarkAttendance, getAttendanceByGroup, getAttendanceSummaryByEnrollment } from '../controllers/attendanceController.js';
import { protect, authorizeRoles } from '../middlewares/autenticationMiddleware.js';

const router = express.Router();

router.post('/bulk', protect, authorizeRoles('Admin', 'Teacher'), bulkMarkAttendance);
router.get('/group/:groupId', protect, authorizeRoles('Admin', 'Teacher', 'Manager'), getAttendanceByGroup);
router.get('/enrollment/:enrollmentId', protect, authorizeRoles('Admin', 'Teacher', 'Manager', 'Student'), getAttendanceSummaryByEnrollment);

export default router;