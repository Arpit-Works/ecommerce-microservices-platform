import productModels from "../models/product.models.js";

// POST /products — Create a new product
export const createProduct = async (req, res) => {
  try {
    const savedProduct = await new productModels(req.body).save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// GET /products/:id — Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await productModels.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// GET /products — Get all products with pagination and filtering
export const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, brand } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const filter = {
      ...(category && { category }),
      ...(brand && { brand }),
    };

    const [products, total] = await Promise.all([
      productModels
        .find(filter)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      productModels.countDocuments(filter),
    ]);

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// PUT /products/:id — Update a product by ID
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await productModels.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// DELETE /products/:id — Delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productModels.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

