const express = require("express");
const router = express.Router();
const addressController = require("../controller/addressController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/", authMiddleware, addressController.addNewAddress);
router.get("/get-address", authMiddleware, addressController.getAddressById);
router.delete("/delete/:id", authMiddleware, addressController.deleteAddress);
router.put("/update/:id", authMiddleware, addressController.updateAddress);
module.exports = router;
