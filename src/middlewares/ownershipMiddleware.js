import Lead from '../models/Lead.js';
import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';

/**
 * Checks if the requesting user is allowed to access a specific lead.
 * - Admin: full access
 * - Manager: all leads
 * - SalesRep: only leads assigned to them
 */
export const checkLeadAccess = async (req, res, next) => {
    const { role, _id: userId } = req.user;

    if (role === 'Admin' || role === 'Manager') return next();

    if (role === 'SalesRep') {
        const leadId = req.params.id;
        if (!leadId) return next(); // list endpoints — filtered in service layer

        const lead = await Lead.findById(leadId).select('assignedTo').lean();
        if (!lead) return next(new ApiError(404, 'Lead not found'));

        if (!lead.assignedTo || lead.assignedTo.toString() !== userId.toString()) {
            return next(new ApiError(403, 'Access denied: this lead is not assigned to you'));
        }
    }

    next();
};

/**
 * Checks if the requesting user is allowed to access a specific task.
 * - Admin: full access
 * - Manager: all tasks
 * - SalesRep / others: only tasks assigned to them
 */
export const checkTaskAccess = async (req, res, next) => {
    const { role, _id: userId } = req.user;

    if (role === 'Admin' || role === 'Manager') return next();

    const taskId = req.params.id;
    if (!taskId) return next();

    const task = await Task.findById(taskId).select('assignedTo createdBy').lean();
    if (!task) return next(new ApiError(404, 'Task not found'));

    const isOwner =
        task.assignedTo?.toString() === userId.toString() ||
        task.createdBy?.toString() === userId.toString();

    if (!isOwner) {
        return next(new ApiError(403, 'Access denied: this task is not assigned to you'));
    }

    next();
};
