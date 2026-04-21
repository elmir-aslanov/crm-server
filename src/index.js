import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoute.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import notFound from './middlewares/notFoundMiddleware.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware

app.use(cors());
app.use(express.json());
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use(notFound);
app.use(errorHandler);





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
