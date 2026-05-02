import express from 'express';
import { 
    getAllStudents, 
    getStudentById, 
    updateStudent, 
    deleteStudent,
    getStudentProfile
} from '../controllers/studentController.js';
import { protect, authorizeRoles } from '../middlewares/autenticationMiddleware.js';

const router = express.Router();

router.get('/profile/me', protect, authorizeRoles('Student'), getStudentProfile);
router.get('/', protect, authorizeRoles('Admin', 'Manager', 'Teacher'), getAllStudents);
router.get('/:id', protect, authorizeRoles('Admin', 'Manager', 'Teacher', 'Student'), getStudentById);
router.put('/:id', protect, authorizeRoles('Admin', 'Manager'), updateStudent);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteStudent);

export default router;
