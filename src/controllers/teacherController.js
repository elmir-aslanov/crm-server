import Group from '../models/Group.js';
import Attendance from '../models/Attendance.js';
import Enrollment from '../models/Enrollment.js';

export const getTeacherGroups = async (req, res, next) => {
    try {
        // req.user is populated by protect middleware
        const groups = await Group.find({ teacherId: req.user._id })
            .populate('courseId', 'name');
        
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
};

export const getTeacherSchedule = async (req, res, next) => {
    try {
        const groups = await Group.find({ teacherId: req.user._id })
            .select('code schedule room startDate endDate');
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
};
