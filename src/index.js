import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import notFound from './middlewares/notFoundMiddleware.js';
import studentRoutes from "./routes/studentRoute.js";
import courseRoutes from "./routes/courseRoutes.js";
import { setupSwagger } from './config/swagger.js';
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(limiter);
setupSwagger(app);
app.use('/api/leads', leadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
