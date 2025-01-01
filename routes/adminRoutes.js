const express = require("express");
const router = express.Router();
const addressController = require("../controller/adminController");
const authMiddleware = require("../middleware/authMiddleware");

module.exports = router;
