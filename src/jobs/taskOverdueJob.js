import cron from 'node-cron';
import Task from '../models/Task.js';
import { emitToUser } from '../utils/socketManager.js';
import { sendTaskReminderEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

/**
 * Runs every hour.
 * Marks past-due tasks as Overdue and fires socket + email notifications.
 */
export const startTaskOverdueJob = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();

            const overdueTasks = await Task.find({
                dueDate: { $lt: now },
                status: { $in: ['Pending', 'In Progress'] },
            }).populate('assignedTo', 'email firstName lastName');

            if (overdueTasks.length === 0) return;

            const ids = overdueTasks.map((t) => t._id);
            await Task.updateMany({ _id: { $in: ids } }, { $set: { status: 'Overdue' } });

            for (const task of overdueTasks) {
                if (!task.assignedTo) continue;

                // Real-time socket notification
                emitToUser(task.assignedTo._id, 'task:overdue', {
                    taskId: task._id,
                    title: task.title,
                    dueDate: task.dueDate,
                });

                // Email — only if not already sent
                if (!task.reminderSentAt) {
                    await sendTaskReminderEmail({
                        to: task.assignedTo.email,
                        taskTitle: task.title,
                        dueDate: task.dueDate,
                    }).catch(() => {});

                    await Task.findByIdAndUpdate(task._id, { reminderSentAt: now });
                }
            }

            logger.info(`taskOverdueJob: marked ${overdueTasks.length} tasks as Overdue`);
        } catch (err) {
            logger.error('taskOverdueJob error:', err);
        }
    });

    logger.info('taskOverdueJob scheduled (every hour)');
};
