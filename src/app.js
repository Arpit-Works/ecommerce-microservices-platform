import express from 'express';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';

const app = express();

app.use(express.json());



app.get('/api', (req, res) => {
  res.send('API running...');
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

export default app;
