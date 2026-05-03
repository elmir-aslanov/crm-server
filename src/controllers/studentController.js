import Student from '../models/Student.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const createStudent = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const existingStudent = await Student.findOne({
        email,
        isDeleted: false,
    });

    if (existingStudent) {
        throw new ApiError(400, 'A student with this email already exists');
    }

    const student = await Student.create(req.body);

    res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student,
    });
});

export const getAllStudents = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';

    const query = search
        ? {
            isDeleted: false,
            $or: [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ],
        }
        : { isDeleted: false };

    const [students, total] = await Promise.all([
        Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Student.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data: students,
    });
});

export const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findOne({
        _id: req.params.id,
        isDeleted: false,
    });

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    res.status(200).json({
        success: true,
        data: student,
    });
});

export const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: student,
    });
});

export const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        {
            isDeleted: true,
            deletedAt: new Date(),
            status: 'Dropped',
        },
        { new: true }
    );

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
    });
});

export const getStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findOne({
        userId: req.user._id,
        isDeleted: false,
    });

    if (!student) {
        throw new ApiError(404, 'Student profile not found');
    }

    res.status(200).json({
        success: true,
        data: student,
    });
});