import express from 'express';
import { 
    getAllGroups, 
    createGroup, 
    addStudentToGroup, 
    getGroupStudents 
} from '../controllers/groupController.js';
import { protect, authorizeRoles } from '../middlewares/autenticationMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllGroups);
router.post('/', protect, authorizeRoles('Admin', 'Manager'), createGroup);
router.post('/enroll', protect, authorizeRoles('Admin', 'Manager'), addStudentToGroup);
router.get('/:id/students', protect, getGroupStudents);

export default router;
