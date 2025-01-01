const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/add", authMiddleware, orderController.addNewOrder);
router.post("/checkout", authMiddleware, orderController.checkOutOrder);
module.exports = router;
