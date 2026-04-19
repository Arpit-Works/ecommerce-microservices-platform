import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
//    Unique alphanumeric code for inventory tracking
  sku: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sale_price: {
    type: Number,
    min: 0,
    validate: {
      validator: function(value) {
        return value <= this.price;
      },
      message: "Sale price should be <= price"
    }
  },
  description: String,

  stock_quantity: {
    type: Number,
    required: true,
    min: 0
  },

  category: {
    type: String,
    required: true
  },

  brand: String,

  attributes: {
    type: Map,
    of: String
  },

  images: [
    {
      url: { type: String, required: true },
      altText: String,
      isPrimary: { type: Boolean, default: false }
    }
  ],

  variants: [
    {
      sku: { type: String, unique: true },
      attributes: {
        size: String,
        color: String
      },
      price: Number,
      stock_quantity: Number,
      image: String
    }
  ],

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);