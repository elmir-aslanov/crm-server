import Student from '../models/Student.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const createStudent = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
        throw new ApiError(400, 'A student with this email already exists');
    }

    const student = await Student.create(req.body);
    res.status(201).json(student);
});

export const getAllStudents = asyncHandler(async (req, res) => {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
});

export const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    res.status(200).json(student);
});

export const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    res.status(200).json(student);
});

export const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    res.status(200).json({ message: 'Student deleted successfully' });
});

export const getStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
        throw new ApiError(404, 'Student profile not found');
    }

    res.status(200).json(student);
});