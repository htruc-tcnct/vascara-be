const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.get("/", productController.getAllProducts);
router.get("/filter", productController.getProductWithCondition);
router.get("/product-detail/:id", productController.getProductWithId);
module.exports = router;
