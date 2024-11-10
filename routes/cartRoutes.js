const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, cartController.addToCart);
router.get("/", authMiddleware, cartController.getCartByUserId);
router.delete("/", authMiddleware, cartController.deleteItems);
router.patch("/", authMiddleware, cartController.updateItems);
module.exports = router;
