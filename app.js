/**
 * ===============================
 *  Car Hire Backend Entry Point
 * ===============================
 */

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// ===============================
// Load Environment Variables
// ===============================
dotenv.config();

// ===============================
// Database Connection
// ===============================
const connectDB = require("./config/db");
connectDB();

// ===============================
// App Initialization
// ===============================
const app = express();

// ===============================
// Global Middleware
// ===============================
app.use(cors({
  origin: "*", // you can lock this down later
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

console.log("✅ Middleware loaded");

// ===============================
// Route Imports
// ===============================
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");

// ===============================
// API Routes
// ===============================
app.use("/api/auth", authRoutes);       // login, register
app.use("/api/admin", adminRoutes);     // admin-only actions
app.use("/api/user", userRoutes);       // user-only actions
app.use("/api", vehicleRoutes);         // public + protected vehicles

console.log("✅ Routes mounted");

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "🚗 Car Hire API is running",
    timestamp: new Date().toISOString()
  });
});

// ===============================
// 404 Handler
// ===============================
app.use((req, res) => {
  res.status(404).json({
    message: "❌ Route not found",
    path: req.originalUrl
  });
});

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

// ===============================
// Server Boot
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=================================");
});
