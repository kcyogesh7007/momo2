const {
  createProduct,

  updateProduct,
  deleteProduct,
} = require("../controller/admin/productController");
const {
  getProducts,
  getProduct,
} = require("../controller/global/globalController");
const isAuthenticated = require("../middleware/isAuthenticated");
const isRestrictTo = require("../middleware/isRestrictTo");

const router = require("express").Router();
const { multer, storage } = require("../middleware/multerConfig");
const catchAsync = require("../services/catchAsync");
const upload = multer({ storage });

router
  .route("/products")
  .post(
    isAuthenticated,
    isRestrictTo("admin"),
    upload.single("productImage"),
    catchAsync(createProduct),
  )
  .get(isAuthenticated, catchAsync(getProducts));
router
  .route("/products/:id")
  .get(catchAsync(getProduct))
  .patch(
    isAuthenticated,
    isRestrictTo("admin"),
    upload.single("productImage"),
    catchAsync(updateProduct),
  )
  .delete(
    isAuthenticated,
    isRestrictTo("admin"),
    upload.single("productImage"),
    catchAsync(deleteProduct),
  );

module.exports = router;
