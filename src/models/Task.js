import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: null,
        },
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lead',
            default: null,
            index: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed', 'Overdue', 'Cancelled'],
            default: 'Pending',
        },
        reminderSentAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

taskSchema.index({ assignedTo: 1, status: 1, dueDate: 1 });
taskSchema.index({ dueDate: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
