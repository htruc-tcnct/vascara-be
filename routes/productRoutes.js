const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router.get("/", productController.getAllProducts);
router.get("/filter", productController.getProductWithCondition);

module.exports = router;
