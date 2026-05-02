import Lead from '../models/Lead.js';
import Payment from '../models/Payment.js';
import Group from '../models/Group.js';
import Enrollment from '../models/Enrollment.js';
import Attendance from '../models/Attendance.js';
import { sumNumericValues } from '../utils/crmMetrics.js';

export const getLeadSourceReport = async (req, res, next) => {
    try {
        const report = await Lead.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json(report.map((item) => ({ source: item._id, count: item.count })));
    } catch (error) {
        next(error);
    }
};

export const getMonthlyRevenueReport = async (req, res, next) => {
    try {
        const report = await Payment.aggregate([
            { $match: { status: 'Paid', paidDate: { $ne: null } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$paidDate' },
                        month: { $month: '$paidDate' }
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.status(200).json(report.map((item) => ({
            year: item._id.year,
            month: item._id.month,
            total: item.total,
        })));
    } catch (error) {
        next(error);
    }
};

export const getGroupFillRateReport = async (req, res, next) => {
    try {
        const groups = await Group.find();
        const report = await Promise.all(groups.map(async (group) => {
            const students = await Enrollment.countDocuments({ groupId: group._id });
            const fillRate = group.maxCapacity ? Number(((students / group.maxCapacity) * 100).toFixed(2)) : 0;

            return {
                groupId: group._id,
                code: group.code,
                capacity: group.maxCapacity,
                students,
                fillRate,
            };
        }));

        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
};

export const getAttendanceReport = async (req, res, next) => {
    try {
        const { groupId, enrollmentId } = req.query;
        const filter = {};

        if (enrollmentId) {
            filter.enrollmentId = enrollmentId;
        } else if (groupId) {
            const enrollments = await Enrollment.find({ groupId }).select('_id');
            filter.enrollmentId = { $in: enrollments.map((item) => item._id) };
        }

        const attendance = await Attendance.find(filter);
        const total = attendance.length;
        const present = attendance.filter((item) => item.status === 'Present' || item.status === 'Late').length;
        const rate = total === 0 ? 0 : Number(((present / total) * 100).toFixed(2));

        res.status(200).json({
            total,
            present,
            absent: total - present,
            rate,
        });
    } catch (error) {
        next(error);
    }
};