import express from 'express';

import {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getStudentProfile,
} from '../controllers/studentController.js';

import { protect, authorizeRoles } from '../middlewares/authenticationMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';

import {
    createStudentValidation,
    updateStudentValidation,
} from '../validations/studentValidation.js';

const router = express.Router();

router.get('/profile/me', protect, authorizeRoles('Student'), getStudentProfile);

router.get('/', protect, authorizeRoles('Admin', 'Manager', 'Teacher'), getAllStudents);

router.post(
    '/',
    protect,
    authorizeRoles('Admin', 'Manager'),
    createStudentValidation,
    validate,
    createStudent
);

router.get(
    '/:id',
    protect,
    authorizeRoles('Admin', 'Manager', 'Teacher', 'Student'),
    getStudentById
);

router.put(
    '/:id',
    protect,
    authorizeRoles('Admin', 'Manager'),
    updateStudentValidation,
    validate,
    updateStudent
);

router.delete('/:id', protect, authorizeRoles('Admin'), deleteStudent);

export default router;