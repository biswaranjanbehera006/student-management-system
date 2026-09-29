const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// ==========================================
// Connect MongoDB
// ==========================================
connectDB();

// ==========================================
// Middleware
// ==========================================
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// Routes
// ==========================================

// Authentication
app.use("/api/auth", authRoutes);

// User
app.use("/api/users", userRoutes);

// Students
app.use("/api/students", studentRoutes);

// ==========================================
// Test Route
// ==========================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Student Management System API is running",
  });
});

// ==========================================
// Server
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});