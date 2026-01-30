const Product = require("../../models/productModel");

exports.createProduct = async (req, res) => {
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
  });
  res.status(200).json({
    message: "Product created successfully",
  });
};
