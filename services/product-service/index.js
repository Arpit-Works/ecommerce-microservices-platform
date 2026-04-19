import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
const SERVICE_NAME = "product-service";
const PORT = process.env.PRODUCT_SERVICE_PORT || 5002;
const MONGO_URI = process.env.PRODUCT_SERVICE_MONGO_URI || process.env.MONGO_URI;

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
    throw new Error("Missing MongoDB URI. Set PRODUCT_SERVICE_MONGO_URI or MONGO_URI.");
  }
  await mongoose.connect(MONGO_URI);
  console.log(`[${SERVICE_NAME}] MongoDB connected`);
};

const start = async () => {
  await connectDB();

  try {
    const { default: productRoutes } = await import("./src/product.routes.js");
    app.use("/api/products", productRoutes);
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
