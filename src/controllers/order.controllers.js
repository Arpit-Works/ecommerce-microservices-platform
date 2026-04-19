import { Order } from "../models/order.models.js";
import Cart from "../models/cart.models.js";   
import Product from "../models/product.models.js";


export const createOrder = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const cart = await Cart.findOne({user: userId})
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        const productIds = cart.items.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });


        const orderItems = cart.items.map(item => {
            const productMap = new Map( products.map(p => [p._id.toString(), p]) );
            const product = products.find(p => p._id.toString() === item.product.toString());
            if (!product) throw new Error(`Product not found: ${item.product}`);
            return {
                productId: item.product,
                quantity: item.quantity,
                price: product.price,
                name: product.name
            }});
        const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

        const order = new Order({
            user: userId,
            items: orderItems,
            totalPrice
        });
        await cart.deleteOne(); 
        await order.save();

        res.status(201).json({ message: 'Order created successfully', order });

    }catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}



export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}



export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });


    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};