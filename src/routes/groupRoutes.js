import express from 'express';
import {
    getAllGroups,
    createGroup,
    addStudentToGroup,
    getGroupStudents
} from '../controllers/groupController.js';
import { protect, authorizeRoles } from '../middlewares/authenticationMiddleware.js';
const router = express.Router();

router.get('/', protect, authorizeRoles('Admin', 'Manager', 'Teacher'), getAllGroups);
router.post('/', protect, authorizeRoles('Admin', 'Manager'), createGroup);
router.post('/enroll', protect, authorizeRoles('Admin', 'Manager'), addStudentToGroup);
router.get('/:id/students', protect, authorizeRoles('Admin', 'Manager', 'Teacher'), getGroupStudents);

export default router;
