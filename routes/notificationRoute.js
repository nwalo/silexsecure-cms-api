const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController/notification");

router.route("/").post(notificationController.createNotification);

module.exports = router;
