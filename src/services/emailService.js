import nodemailer from 'nodemailer';

const getTransporter = () => {
    if (!process.env.SMTP_HOST) return null;
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

export const sendTaskReminderEmail = async ({ to, taskTitle, dueDate }) => {
    const transporter = getTransporter();
    if (!transporter) return;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@crm.local',
        to,
        subject: `[CRM] Task Reminder: ${taskTitle}`,
        html: `
            <h3>Task Reminder</h3>
            <p>Your task <strong>${taskTitle}</strong> is overdue.</p>
            <p>Due date: <strong>${new Date(dueDate).toLocaleString()}</strong></p>
            <p>Please log in to the CRM to update its status.</p>
        `,
    });
};

export const sendTaskAssignedEmail = async ({ to, taskTitle, assignedBy, dueDate }) => {
    const transporter = getTransporter();
    if (!transporter) return;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@crm.local',
        to,
        subject: `[CRM] New Task Assigned: ${taskTitle}`,
        html: `
            <h3>New Task Assigned</h3>
            <p>You have been assigned a new task: <strong>${taskTitle}</strong></p>
            <p>Assigned by: <strong>${assignedBy}</strong></p>
            <p>Due date: <strong>${new Date(dueDate).toLocaleString()}</strong></p>
        `,
    });
};
