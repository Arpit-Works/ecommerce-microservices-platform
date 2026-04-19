import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
const SERVICE_NAME = "auth-service";
const PORT = process.env.AUTH_SERVICE_PORT || 5001;
const MONGO_URI = process.env.AUTH_SERVICE_MONGO_URI || process.env.MONGO_URI;

app.use(express.json());

app.get("/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    service: SERVICE_NAME,
    status: dbConnected ? "ok" : "degraded",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("Missing MongoDB URI. Set AUTH_SERVICE_MONGO_URI or MONGO_URI.");
  }
  await mongoose.connect(MONGO_URI);
  console.log(`[${SERVICE_NAME}] MongoDB connected`);
};

const start = async () => {
  await connectDB();

  try {
    const { default: authRoutes } = await import("./src/auth.routes.js");
    app.use("/api/auth", authRoutes);
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
