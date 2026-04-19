import { Router } from "express";
import { createOrder, getUserOrders, updateOrderStatus, getOrderById } from "../controllers/order.controllers.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);
router.get("/:orderId", authMiddleware, getOrderById);          // 
router.put("/:orderId/status", authMiddleware, adminMiddleware, updateOrderStatus);


export default router;