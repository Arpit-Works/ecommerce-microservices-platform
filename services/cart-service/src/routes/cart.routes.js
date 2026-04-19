import { Router } from "express";
import { getCart, addToCart, removeCartItem, clearCart, updateCartItem } from "../controllers/cart.controllers.js";

const router = Router();

router.post("/", addToCart);
router.get("/",  getCart);
router.put("/:productId",  updateCartItem);
router.delete("/:productId",  removeCartItem);
router.delete("/", clearCart);  

export default router;
