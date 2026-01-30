const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "productName must be provided"],
    },
    productDescription: {
      type: String,
      required: [true, "product description must be provided"],
    },
    productStatus: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    productStockQty: {
      type: Number,
      required: [true, "product stock qty must be provided"],
    },
    productPrice: {
      type: Number,
      required: [true, "Product price must be provided"],
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
