// 1. Initialize environment variables first before importing modules
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { connectDB, disconnectDB } = require("./config/db");
const authRoutes = require("./routes/auth");
const slotRoutes = require("./routes/slot");
const { apiLimiter } = require("./middleware/rateLimiter");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 6767;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_farmy";

// Security audit warning if default weak JWT secret is detected
if (JWT_SECRET === "yourSecretKey" || JWT_SECRET === "fallback_secret_farmy") {
  console.warn(
    "[SECURITY WARNING]: JWT_SECRET is using a weak or default key. Please configure a strong random secret in your production .env file."
  );
}

// 2. CORS configuration (allowing frontend development port)
const allowedOrigins = [
  "http://localhost:5173", // Vite dev default
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Dev fallback
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Request parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 4. Rate limiting on all API routes
app.use("/api", apiLimiter);

// 5. Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    smsProvider: (process.env.SMS_PROVIDER || "mock").toLowerCase(),
  });
});

// Root debug info
app.get("/", (req, res) => {
  res.json({
    service: "Farmy Crop Procurement API",
    version: "2.0.0",
    docs: "/api",
  });
});

// 6. 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// 7. Database connection & Server initialization
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[Server] Farmy Backend running at http://localhost:${PORT}`);
  });

  // Graceful shutdown handling
  const handleExit = async (signal) => {
    console.log(`[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => handleExit("SIGINT"));
  process.on("SIGTERM", () => handleExit("SIGTERM"));
};

startServer();

module.exports = app;
