const Product = require("../../models/productModel");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  const file = req.file;
  let filepath;
  if (!file) {
    filepath =
      "https://imgs.search.brave.com/LxvhV3rzsxHyhMkkd-7Zhw5mHRIOt9IbHtuZQE49xDA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wZWJi/bGVseS5jb20vX251/eHQvcmV1c2UtYmFj/a2dyb3VuZC1leGFt/cGxlcy5kMzJhNmZh/Zi5qcGc";
  } else {
    filepath = req.file.filename;
  }
  const {
    productName,
    productDescription,
    productStockQty,
    productStatus,
    productPrice,
  } = req.body;
  if (
    !productName ||
    !productDescription ||
    !productStockQty ||
    !productStatus ||
    !productPrice
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,productStockQty,productStatus and product Price",
    });
  }
  await Product.create({
    productName,
    productDescription,
    productStatus,
    productStockQty,
    productPrice,
    productImage: process.env.BACKEND_URL + filepath,
  });
  res.status(200).json({
    message: "Product created successfully",
  });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id",
    });
  }
  const oldData = await Product.findById(id);
  if (!oldData) {
    return res.status(400).json({
      message: "No product found with that id",
    });
  }
  const oldProductImage = oldData.productImage;
  const lengthToCut = process.env.BACKEND_URL.length;
  const finalPath = oldProductImage.slice(lengthToCut);
  fs.unlink("./uploads/" + finalPath, (err) => {
    if (err) {
      console.log("Error deleting file", err);
    } else {
      console.log("File deleted successfully");
    }
  });
  await Product.findByIdAndDelete(id);
  res.status(200).json({
    message: "Product deleted successfully",
  });
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    productName,
    productDescription,
    productStockQty,
    productStatus,
    productPrice,
  } = req.body;
  if (
    !productName ||
    !productDescription ||
    !productStockQty ||
    !productStatus ||
    !productPrice ||
    !id
  ) {
    return res.status(400).json({
      message:
        "Please provide productName,productDescription,productStockQty,productStatus,id and product Price",
    });
  }
  const oldProduct = await Product.findById(id);
  if (!oldProduct) {
    return res.status(404).json({
      message: "No product found with that id",
    });
  }
  const oldProductImage = oldProduct.productImage;
  const lengthToCut = process.env.BACKEND_URL.length;
  const finalLength = oldProductImage.slice(lengthToCut);
  if (req.file && req.file.filename) {
    fs.unlink("./uploads/" + finalLength, (err) => {
      if (err) {
        console.log("error deleting file", err);
      } else {
        console.log("File deleted successfully");
      }
    });
  }
  const datas = await Product.findByIdAndUpdate(
    id,
    {
      productName,
      productDescription,
      productStatus,
      productStockQty,
      productPrice,
      productImage:
        req.file && req.file.filename
          ? process.env.BACKEND_URL + req.file.filename
          : oldProductImage,
    },
    { new: true },
  );
  res.status(200).json({
    message: "Product updated successfully",
    datas,
  });
};
