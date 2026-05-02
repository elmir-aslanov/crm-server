import Lead from '../models/Lead.js';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';
import Group from '../models/Group.js';
import Course from '../models/Course.js';
import { calculateConversionRate, sumNumericValues } from '../utils/crmMetrics.js';

export const getDashboardStats = async (req, res, next) => {
    try {
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const [newLeads, totalLeads, activeStudents, students, paidThisMonth, overduePayments, enrollments] = await Promise.all([
            Lead.countDocuments({ createdAt: { $gte: monthStart } }),
            Lead.countDocuments(),
            Student.countDocuments({ status: 'Active' }),
            Student.find(),
            Payment.find({ status: 'Paid', paidDate: { $gte: monthStart } }),
            Payment.find({ status: 'Overdue' }),
            Enrollment.find().populate({ path: 'groupId', populate: { path: 'courseId', select: 'name' } }),
        ]);

        const courseDistributionMap = new Map();
        for (const enrollment of enrollments) {
            const courseName = enrollment.groupId?.courseId?.name || 'Unknown';
            courseDistributionMap.set(courseName, (courseDistributionMap.get(courseName) || 0) + 1);
        }

        const courseDistribution = Array.from(courseDistributionMap.entries()).map(([name, value]) => ({ name, value }));

        res.status(200).json({
            newLeadsThisMonth: newLeads,
            conversionRate: calculateConversionRate(totalLeads, activeStudents),
            activeStudents,
            totalStudents: students.length,
            collectedPaymentsThisMonth: sumNumericValues(paidThisMonth, 'amount'),
            overdueAmount: sumNumericValues(overduePayments, 'amount'),
            courseDistribution,
        });
    } catch (error) {
        next(error);
    }
};

export const getDashboardSummary = getDashboardStats;