const { createProduct } = require("../controller/admin/productController");

const router = require("express").Router();

router.route("/products").post(createProduct);

module.exports = router;
