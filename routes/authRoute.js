const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController/auth");

router.route("/register").post(userController.createUser);
router.route("/login").post(userController.loginUser);
router.route("/logout").post(userController.logout);
module.exports = router;
