import Student from '../models/Student.js';
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
    }
};

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
    }
};

export const updateStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json(student);
    } catch (error) {
        next(error);
    }
};

export const deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json({ message: 'Student deleted' });
    } catch (error) {
        next(error);
    }
};
