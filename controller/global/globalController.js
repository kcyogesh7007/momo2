const Product = require("../../models/productModel");
const Review = require("../../models/reviewModel");

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  if (products.length == 0) {
    return res.status(404).json({
      message: "No products found",
    });
  }
  res.status(200).json({
    message: "Products fetched successfully",
    data: products,
  });
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id",
    });
  }
  const product = await Product.findById(id);
  const productReviews = await Review.find({ productId: id }).populate(
    "userId",
  );
  if (!product) {
    return res.status(400).json({
      message: "No product found with that id",
    });
  }
  res.status(200).json({
    message: "Product fetched successfully",
    data: product,
    productReviews,
  });
};
