import Task from '../models/Task.js';
import User from '../models/Users.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { emitToUser } from '../utils/socketManager.js';
import { sendTaskAssignedEmail } from '../services/emailService.js';

export const createTask = asyncHandler(async (req, res) => {
    const { assignedTo, dueDate } = req.body;
    if (!assignedTo || !dueDate) throw new ApiError(400, 'assignedTo and dueDate are required');

    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    await task.populate([
        { path: 'assignedTo', select: 'firstName lastName email' },
        { path: 'leadId', select: 'firstName lastName phone' },
    ]);

    // Notify assignee
    emitToUser(assignedTo, 'task:assigned', {
        taskId: task._id,
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
    });

    // Send email notification
    if (task.assignedTo?.email) {
        const assignedByName = `${req.user.firstName} ${req.user.lastName}`;
        sendTaskAssignedEmail({
            to: task.assignedTo.email,
            taskTitle: task.title,
            assignedBy: assignedByName,
            dueDate: task.dueDate,
        }).catch(() => {});
    }

    res.status(201).json(task);
});

export const getTasks = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};

    // Non-admin users only see their tasks
    if (req.user.role !== 'Admin' && req.user.role !== 'Manager') {
        filter.assignedTo = req.user._id;
    } else if (req.query.assignedTo) {
        filter.assignedTo = req.query.assignedTo;
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.leadId) filter.leadId = req.query.leadId;

    if (req.query.dueBefore) {
        filter.dueDate = { ...filter.dueDate, $lte: new Date(req.query.dueBefore) };
    }
    if (req.query.dueAfter) {
        filter.dueDate = { ...filter.dueDate, $gte: new Date(req.query.dueAfter) };
    }

    const sort = { dueDate: req.query.sortBy === 'newest' ? -1 : 1 };

    const [tasks, total] = await Promise.all([
        Task.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('assignedTo', 'firstName lastName role')
            .populate('createdBy', 'firstName lastName')
            .populate('leadId', 'firstName lastName phone')
            .lean(),
        Task.countDocuments(filter),
    ]);

    res.status(200).json({ tasks, total, page, pages: Math.ceil(total / limit) });
});

export const getTaskById = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)
        .populate('assignedTo', 'firstName lastName email role')
        .populate('createdBy', 'firstName lastName')
        .populate('leadId', 'firstName lastName phone status');
    if (!task) throw new ApiError(404, 'Task not found');
    res.status(200).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) throw new ApiError(404, 'Task not found');

    const prevStatus = task.status;
    Object.assign(task, req.body);
    await task.save();

    // Notify if status changed to Completed
    if (prevStatus !== 'Completed' && task.status === 'Completed') {
        emitToUser(task.createdBy, 'task:completed', {
            taskId: task._id,
            title: task.title,
            completedBy: req.user._id,
        });
    }

    await task.populate('assignedTo', 'firstName lastName role');
    res.status(200).json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) throw new ApiError(404, 'Task not found');
    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted' });
});

export const getMyTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({
        assignedTo: req.user._id,
        status: { $in: ['Pending', 'In Progress', 'Overdue'] },
    })
        .sort({ dueDate: 1 })
        .populate('leadId', 'firstName lastName phone')
        .lean();

    res.status(200).json(tasks);
});
