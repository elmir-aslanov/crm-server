  import express from 'express';
  import dotenv from 'dotenv';
  import cors from 'cors';
  import dns from 'dns';
  import connectDB from './config/db.js';
  import leadRoutes from './routes/leadRoutes.js';
  import authRoutes from './routes/authRoute.js';
  import courseRoutes from './routes/courseRoutes.js';
  import groupRoutes from './routes/groupRoutes.js';
  import teacherRoutes from './routes/teacherRoutes.js';
  import userRoutes from './routes/userRoutes.js';
  import paymentRoutes from './routes/paymentRoutes.js';
  import attendanceRoutes from './routes/attendanceRoutes.js';
  import dashboardRoutes from './routes/dashboardRoutes.js';
  import reportRoutes from './routes/reportRoutes.js';
  import docsRoute from './routes/docsRoute.js';
  import { errorHandler } from './middlewares/errorMiddleware.js';
  import notFound from './middlewares/notFoundMiddleware.js';
  import studentRoutes from "./routes/studentRoute.js";//
  import rateLimitMiddleware from './middlewares/rateLimitMiddleware.js';
  import seedDatabase from './seed/seedData.js';
  // Load env vars
  dotenv.config();

  // Set DNS servers programmatically
  dns.setServers(['8.8.8.8', '1.1.1.1']);

  // Connect to database
  const startServer = async () => {
    await connectDB();

    if (process.env.SEED_ON_START !== 'false') {
      await seedDatabase();
    }

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  };

  const app = express();

  // Middleware

  app.use(
    cors({
      origin: "http://localhost:8080",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(rateLimitMiddleware);
  app.use('/api/leads', leadRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/groups', groupRoutes);
  app.use('/api/teachers', teacherRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/docs', docsRoute);
  app.use("/api/students", studentRoutes);//
  app.use(notFound);
  app.use(errorHandler);

  startServer();
