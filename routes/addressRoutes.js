const express = require("express");
const router = express.Router();
const addNewAddress = require("../controller/addressController");
const authMiddleware = require("../middleware/authMiddleware");
router.post("/", authMiddleware, addNewAddress.addNewAddress);

module.exports = router;
