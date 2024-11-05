const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, cartController.addToCart);
router.get("/", authMiddleware, cartController.getCartByUserId);
module.exports = router;
