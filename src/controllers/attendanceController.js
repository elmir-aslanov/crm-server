import Attendance from '../models/Attendance.js';
import Enrollment from '../models/Enrollment.js';
import Group from '../models/Group.js';

export const bulkMarkAttendance = async (req, res, next) => {
    try {
        const { groupId, date, records } = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ message: 'records array is required' });
        }

        const attendanceDate = date ? new Date(date) : new Date();
        const results = [];

        for (const record of records) {
            const enrollment = await Enrollment.findById(record.enrollmentId);
            if (!enrollment || String(enrollment.groupId) !== String(groupId)) {
                continue;
            }

            const attendance = await Attendance.findOneAndUpdate(
                { enrollmentId: record.enrollmentId, date: attendanceDate },
                {
                    enrollmentId: record.enrollmentId,
                    date: attendanceDate,
                    status: record.status,
                    markedBy: req.user._id,
                    note: record.note || ''
                },
                { new: true, upsert: true }
            );

            results.push(attendance);
        }

        res.status(201).json({ count: results.length, records: results });
    } catch (error) {
        next(error);
    }
};

export const getAttendanceByGroup = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ groupId: req.params.groupId }).select('_id');
        const attendance = await Attendance.find({ enrollmentId: { $in: enrollments.map((item) => item._id) } })
            .populate({ path: 'enrollmentId', populate: { path: 'studentId', select: 'firstName lastName studentCode' } })
            .populate('markedBy', 'firstName lastName role')
            .sort({ date: -1 });

        res.status(200).json(attendance);
    } catch (error) {
        next(error);
    }
};

export const getAttendanceSummaryByEnrollment = async (req, res, next) => {
    try {
        const attendance = await Attendance.find({ enrollmentId: req.params.enrollmentId });
        const total = attendance.length;
        const present = attendance.filter((item) => item.status === 'Present' || item.status === 'Late').length;
        const percentage = total === 0 ? 0 : Number(((present / total) * 100).toFixed(2));

        res.status(200).json({ total, present, percentage });
    } catch (error) {
        next(error);
    }
};