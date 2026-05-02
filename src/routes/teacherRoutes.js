import express from 'express';
import { getTeacherGroups, getTeacherSchedule } from '../controllers/teacherController.js';
import { protect, authorizeRoles } from '../middlewares/autenticationMiddleware.js';

const router = express.Router();

router.get('/groups/me', protect, authorizeRoles('Teacher'), getTeacherGroups);
router.get('/schedule/me', protect, authorizeRoles('Teacher'), getTeacherSchedule);

export default router;
