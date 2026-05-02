import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoute.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import notFound from './middlewares/notFoundMiddleware.js';
import studentRoutes from "./routes/studentRoutes.js";//
// Load env vars
dotenv.config();

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

app.use(cors());
app.use(express.json());
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use(notFound);
app.use(errorHandler);
app.use("/api/students", studentRoutes);//





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
