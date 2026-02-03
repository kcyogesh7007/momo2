const {
  createReview,

  getMyReview,
  deleteReview,
} = require("../controller/admin/user/review/ReviewController");
const isAuthenticated = require("../middleware/isAuthenticated");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router.route("/reviews").get(isAuthenticated, catchAsync(getMyReview));
router
  .route("/reviews/:id")
  .post(isAuthenticated, catchAsync(createReview))

  .delete(isAuthenticated, catchAsync(deleteReview));

module.exports = router;
