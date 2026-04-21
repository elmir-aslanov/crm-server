import express from 'express';
import {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
} from '../controllers/teacherController.js';

const router = express.Router();

// Base route: /api/teachers
router.route('/')
    .post(createTeacher)
    .get(getAllTeachers);

router.route('/:id')
    .get(getTeacherById)
    .put(updateTeacher)
    .delete(deleteTeacher);

export default router;