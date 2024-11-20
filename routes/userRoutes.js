const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", userController.signup);
router.post("/login", userController.login);

router.get("/:email", userController.getUserByEmail);

router.get("/id/:id", authMiddleware, userController.getUserById);

router.post("/reset-password/:id/:token", userController.reset_password);
router.post("/request-reset-password", userController.requestResetPassword);
router.put("/update/:userId", userController.updateInfo);
router.put("/update-password", authMiddleware, userController.updatePass);

module.exports = router;
