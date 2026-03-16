import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import weddingRoutes from './routes/weddingRoutes.js';
import decorRoutes from './routes/decorRoutes.js';
import artistRoutes from './routes/artistRoutes.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/decor', decorRoutes);
app.use('/api/artists', artistRoutes);



// Base route
app.get('/', (req, res) => {
  res.json({ message: 'BudgetBandhan API is running' });
});


// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});