import Cart from "../models/cart.models.js";
import Product from "../models/product.models.js";

const recalculateTotalPrice = async (cart) => {
    if (!cart.items.length) {
        cart.totalPrice = 0;
        return;
    }

    const productIds = cart.items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } }).select("price sale_price");
    const priceById = new Map(products.map((product) => [
        product._id.toString(),
        product.sale_price ?? product.price
    ]));

    cart.totalPrice = cart.items.reduce((sum, item) => {
        const unitPrice = priceById.get(item.product.toString()) ?? 0;
        return sum + (unitPrice * item.quantity);
    }, 0);
};

export const addToCart = async (req, res)=>{
    try {
        const userId = req.user?.userId;
        const { productId, quantity = 1 } = req.body;
        const parsedQuantity = Number(quantity);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }

        if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).json({ message: "quantity must be at least 1" });
        }

        let cart = await Cart.findOne({user: userId});
        
        if (!cart){
            cart = new Cart({user: userId, items: [], totalPrice: 0});
        }

        const existingItem = cart.items.find( item => item.product.toString() === productId);

        if (existingItem){
            existingItem.quantity += parsedQuantity;
        } 
        else {
            cart.items.push({product: productId, quantity: parsedQuantity});
        }

        await recalculateTotalPrice(cart);
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getCart = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const cartItems = await Cart.findOne({user: userId}).populate('items.product');
        if (!cartItems){
            return res.json({ items: [], totalPrice: 0 });
        }
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}


export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { productId } = req.params;
        const {quantity} = req.body;
        const parsedQuantity = Number(quantity);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).json({ message: "quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart){
            return res.status(404).json({message: "Cart not found"});
        }

        const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);
        if (!item){
            return res.status(404).json({message: "Cart item not found"});
        }

        item.quantity = parsedQuantity;
        await recalculateTotalPrice(cart);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }


export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { productId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        await recalculateTotalPrice(cart);
        await cart.save();

        res.status(200).json({message: "Cart item removed", cart});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Cart.findOneAndDelete({ user: userId });

    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  
