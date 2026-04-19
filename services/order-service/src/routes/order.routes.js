import { Router } from "express";
import { createOrder, getUserOrders, updateOrderStatus, getOrderById } from "../controllers/order.controllers.js";

const router = Router();

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:orderId", getOrderById);
router.put("/:orderId/status", updateOrderStatus);


export default router;
