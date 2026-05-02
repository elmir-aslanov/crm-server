import Student from '../models/Student.js';
<<<<<<< HEAD
import Enrollment from '../models/Enrollment.js';
import PaymentPlan from '../models/PaymentPlan.js';

export const getStudentProfile = async (req, res, next) => {
    try {
        const student = await Student.findOne({ userId: req.user._id });
        if (!student) return res.status(404).json({ message: 'Student profile not found' });

        const enrollments = await Enrollment.find({ studentId: student._id })
            .populate('groupId', 'code schedule room');

        const paymentPlans = await PaymentPlan.find({ 
            enrollmentId: { $in: enrollments.map(e => e._id) } 
        });

        res.status(200).json({
            student,
            enrollments,
            paymentPlans
        });
    } catch (error) {
        next(error);
=======
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// @desc    Create new student
// @route   POST /api/students
export const createStudent = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
        throw new ApiError(400, 'A student with this email already exists');
>>>>>>> 72da21a860da6e2fc8ea7d57c6763f03c1f3e5be
    }

    const student = await Student.create(req.body);
    res.status(201).json(student);
});

<<<<<<< HEAD
export const getAllStudents = async (req, res, next) => {
    try {
        const students = await Student.find().populate('leadId');
        res.status(200).json(students);
    } catch (error) {
        next(error);
    }
};

export const getStudentById = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id).populate('leadId');
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student);
    } catch (error) {
        next(error);
=======
// @desc    Get all students
// @route   GET /api/students
export const getAllStudents = asyncHandler(async (req, res) => {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
});

// @desc    Get student by ID
// @route   GET /api/students/:id
export const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        throw new ApiError(404, 'Student not found');
>>>>>>> 72da21a860da6e2fc8ea7d57c6763f03c1f3e5be
    }

    res.status(200).json(student);
});

<<<<<<< HEAD
export const updateStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student);
    } catch (error) {
        next(error);
=======
// @desc    Update student
// @route   PUT /api/students/:id
export const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!student) {
        throw new ApiError(404, 'Student not found');
>>>>>>> 72da21a860da6e2fc8ea7d57c6763f03c1f3e5be
    }

    res.status(200).json(student);
});

<<<<<<< HEAD
export const deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json({ message: 'Student deleted' });
    } catch (error) {
        next(error);
    }
};
=======
// @desc    Delete student
// @route   DELETE /api/students/:id
export const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
        throw new ApiError(404, 'Student not found');
    }

    res.status(200).json({ message: 'Student deleted successfully' });
});
>>>>>>> 72da21a860da6e2fc8ea7d57c6763f03c1f3e5be
