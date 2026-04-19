import {Router} from 'express';
import {getAllProducts, getProductById, createProduct, updateProduct, deleteProduct} from '../controllers/product.controllers.js';
import adminMiddleware   from '../middleware/admin.js';
import authMiddleware   from '../middleware/auth.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/',authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;