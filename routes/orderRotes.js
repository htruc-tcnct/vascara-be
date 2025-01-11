const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const { appengine } = require("googleapis/build/src/apis/appengine");
router.post("/add", authMiddleware, orderController.addNewOrder);
router.get(
  "/getAllById/:idUser",
  authMiddleware,
  orderController.getAllOrderById
);
router.post("/checkout", authMiddleware, orderController.checkOutOrder);
router.post("/callback", orderController.callbackURL);
router.post("/transaction", orderController.transaction);
module.exports = router;
