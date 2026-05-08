import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import { setupSwagger } from './config/swagger.js';
import { initSocket } from './utils/socketManager.js';
import { startTaskOverdueJob } from './jobs/taskOverdueJob.js';

import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';
import studentRoutes from './routes/studentRoute.js';
import leadRoutes from './routes/leadRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import interactionRoutes from './routes/interactionRoutes.js';

import { errorHandler } from './middlewares/errorMiddleware.js';
import notFound from './middlewares/notFoundMiddleware.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io
initSocket(server);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'];

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/leads/:leadId/interactions', interactionRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/tasks', taskRoutes);

setupSwagger(app);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const startServer = async () => {
    await connectDB();
    startTaskOverdueJob();
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
