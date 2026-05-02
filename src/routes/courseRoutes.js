import express from 'express';
import { 
    getAllCourses, 
    getCourseById, 
    createCourse, 
    updateCourse,
    getAllCategories,
    createCategory
} from '../controllers/courseController.js';
import { protect, authorizeRoles } from '../middlewares/autenticationMiddleware.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/categories', getAllCategories);
router.get('/:id', getCourseById);

// Admin only routes
router.post('/', protect, authorizeRoles('Admin'), createCourse);
router.put('/:id', protect, authorizeRoles('Admin'), updateCourse);
router.post('/categories', protect, authorizeRoles('Admin'), createCategory);

export default router;
