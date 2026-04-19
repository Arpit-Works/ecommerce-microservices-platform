import "dotenv/config";
import express from "express";
import indexRoutes from "./routes/index.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "api-gateway",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", indexRoutes);

app.listen(PORT, () => {
  console.log(`[api-gateway] running on port ${PORT}`);
});
