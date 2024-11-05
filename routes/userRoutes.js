const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/register", userController.signup);
router.post("/login", userController.login);
router.get("/:email", userController.getUserById);
router.post("/reset-password/:id/:token", userController.reset_password);
router.post("/request-reset-password", userController.requestResetPassword);
module.exports = router;
