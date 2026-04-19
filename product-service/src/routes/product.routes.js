import {Router} from 'express';
import {getAllProducts, getProductById, createProduct, updateProduct, deleteProduct} from '../controllers/product.controllers.js';
import internalMiddleware from "../middleware/internal.middleware.js";

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', internalMiddleware, createProduct);
router.put('/:id', internalMiddleware, updateProduct);
router.delete('/:id', internalMiddleware, deleteProduct);

export default router;
