import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import weddingRoutes from "./routes/weddingRoutes.js";
import decorRoutes from "./routes/decorRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import fnbRoutes from "./routes/fnbRoutes.js";
import logisticsRoutes from "./routes/logisticsRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

// Connect to database
connectDB();

const app = express();

// ========== FIXED CORS CONFIGURATION ==========
const allowedOrigins = [
  'https://budget-bandhan.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// IMPORTANT: Handle preflight requests for all routes
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/weddings", weddingRoutes);
app.use("/api/decor", decorRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/fnb", fnbRoutes);
app.use("/api/logistics", logisticsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

// Add this AFTER all route registrations (for debugging)
console.log("=== REGISTERED ROUTES ===");
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
  } else if (r.name === "router") {
    r.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(
          `${Object.keys(handler.route.methods)} /api${handler.route.path}`,
        );
      }
    });
  }
});
console.log("========================");

// Base route
app.get("/", (req, res) => {
  res.json({ message: "BudgetBandhan API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});