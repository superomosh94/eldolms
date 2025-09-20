require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(helmet()); // security headers
app.use(morgan("dev")); // request logging
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
