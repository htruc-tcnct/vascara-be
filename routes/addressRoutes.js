const express = require("express");
const router = express.Router();
const addressController = require("../controller/addressController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/", authMiddleware, addressController.addNewAddress);
router.get("/get-address", authMiddleware, addressController.getAddressById);
module.exports = router;
