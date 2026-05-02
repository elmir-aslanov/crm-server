import Group from '../models/Group.js';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import PaymentPlan from '../models/PaymentPlan.js';
import Payment from '../models/Payment.js';

const addMonths = (date, months) => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + months);
    return next;
};

// Groups
export const getAllGroups = async (req, res, next) => {
    try {
        const groups = await Group.find()
            .populate('courseId', 'name')
            .populate('teacherId', 'firstName lastName');
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
};

export const createGroup = async (req, res, next) => {
    try {
        const group = await Group.create(req.body);
        res.status(201).json(group);
    } catch (error) {
        next(error);
    }
};

// Enrollments
export const addStudentToGroup = async (req, res, next) => {
    try {
        const { studentId, groupId, totalAmount, discountAmount = 0, discountReason = '', installmentCount = 1 } = req.body;
        
        // Check if group is full
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const existingEnrollment = await Enrollment.findOne({ studentId, groupId });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'Student already enrolled in this group' });
        }

        const enrollmentCount = await Enrollment.countDocuments({ groupId });
        
        if (enrollmentCount >= group.maxCapacity) {
            return res.status(400).json({ message: 'Group is at maximum capacity' });
        }

        const enrollment = await Enrollment.create({ studentId, groupId });

        const course = await Course.findById(group.courseId);
        const baseAmount = Number(totalAmount ?? course?.price ?? 0);
        const discount = Number(discountAmount || 0);
        const netAmount = Math.max(baseAmount - discount, 0);
        const paymentsCount = Math.max(Number(installmentCount || 1), 1);

        const paymentPlan = await PaymentPlan.create({
            enrollmentId: enrollment._id,
            totalAmount: baseAmount,
            discountAmount: discount,
            discountReason: discountReason || null,
            netAmount,
            installmentCount: paymentsCount,
        });

        const installmentAmount = Number((netAmount / paymentsCount).toFixed(2));
        const paymentPromises = Array.from({ length: paymentsCount }, (_, index) => Payment.create({
            paymentPlanId: paymentPlan._id,
            amount: index === paymentsCount - 1 ? Number((netAmount - installmentAmount * (paymentsCount - 1)).toFixed(2)) : installmentAmount,
            dueDate: addMonths(new Date(), index),
            status: 'Pending',
            paymentMethod: 'Cash',
            recordedBy: req.user?._id || null,
        }));

        const payments = await Promise.all(paymentPromises);

        res.status(201).json({ enrollment, paymentPlan, payments });
    } catch (error) {
        next(error);
    }
};

export const getGroupStudents = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ groupId: req.params.id })
            .populate('studentId', 'firstName lastName email studentCode');
        res.status(200).json(enrollments);
    } catch (error) {
        next(error);
    }
};
