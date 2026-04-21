import express from 'express';
import {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from '../controllers/studentController.js';

const router = express.Router();

// Root path /api/students
router.route('/')
    .post(createStudent)
    .get(getAllStudents);

// ID-specific paths /api/students/:id
router.route('/:id')
    .get(getStudentById)
    .put(updateStudent)
    .delete(deleteStudent);

export default router;