import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';

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

import { errorHandler } from './middlewares/errorMiddleware.js';
import notFound from './middlewares/notFoundMiddleware.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://172.21.240.1:8080',
    'http://192.168.119.1:8080',
  ],
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/teachers', teacherRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
