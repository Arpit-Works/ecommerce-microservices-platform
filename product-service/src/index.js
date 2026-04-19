import "dotenv/config";
import express from "express";

const app = express();
const SERVICE_NAME = "product-service";
const PORT = process.env.PRODUCT_SERVICE_PORT || 5002;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    service: SERVICE_NAME,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

const start = async () => {
  try {
    const { default: productRoutes } = await import("./routes/product.routes.js");
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
