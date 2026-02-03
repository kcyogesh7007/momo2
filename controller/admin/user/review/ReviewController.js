const Product = require("../../../../models/productModel");
const Review = require("../../../../models/reviewModel");

exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const { rating, message } = req.body;
  const productId = req.params.id;
  if (!rating || !productId || !message) {
    return res.status(400).json({
      message: "Please provide rating,productId and message",
    });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(400).json({
      message: "No product found with that Id",
    });
  }
  await Review.create({
    rating,
    productId,
    message,
    userId,
  });
  res.status(201).json({
    message: "Review added successfully",
  });
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  //check if that user created this review
  const userId = req.user.id;
  const review = await Review.findById(reviewId);
  const ownerIdofReview = review.userId;
  if (ownerIdofReview !== userId) {
    return res.status(400).json({
      message: "You don't have permission to delete this review",
    });
  }
  if (!reviewId) {
    return res.status(400).json({
      message: "Please provide reviewId",
    });
  }
  const reviewExist = await Review.findById(reviewId);
  if (!reviewExist) {
    return res.status(400).json({
      message: "No review found with that reviewId",
    });
  }
  await Review.findByIdAndDelete(reviewId);
  res.status(200).json({
    message: "Review deleted successfully",
  });
};

exports.getMyReview = async (req, res) => {
  const userId = req.user.id;
  const reviews = await Review.find({ userId });
  if (reviews.length == 0) {
    res.status(400).json({
      message: "You haven't given review to any products yet",
    });
  } else {
    res.status(200).json({
      message: "Review fetched successfully",
    });
  }
};
