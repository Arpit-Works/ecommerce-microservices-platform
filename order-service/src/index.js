import "dotenv/config";
import express from "express";

const app = express();
const SERVICE_NAME = "order-service";
const PORT = process.env.ORDER_SERVICE_PORT || 5003;

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
    const { default: orderRoutes } = await import("./routes/order.routes.js");
    app.use("/api/orders", orderRoutes);
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
