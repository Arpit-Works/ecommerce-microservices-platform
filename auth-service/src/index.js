import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

const app = express();
const SERVICE_NAME = "auth-service";
const PORT = process.env.AUTH_SERVICE_PORT || 5001;

app.use(express.json());

app.get("/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    service: SERVICE_NAME,
    status: dbConnected ? "ok" : "degraded",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

const start = async () => {
  await connectDB();

  try {
    const { default: authRoutes } = await import("./routes/auth.routes.js");
    app.use("/auth", authRoutes);
  } catch (error) {
    console.error(`[${SERVICE_NAME}] Route mount failed: ${error.message}`);
  }

  app.listen(PORT, () => {
    console.log(`[${SERVICE_NAME}] running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error(`[${SERVICE_NAME}] startup failed: ${error.message}`);
  process.exit(1);
});
