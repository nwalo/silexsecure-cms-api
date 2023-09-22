const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController/dashboard");
const { verify } = require("../middleware/authMiddleware");

router.route("/statistics").get(verify, dashboardController.webStatistics);
router.route("/recent-changes").get(verify, dashboardController.recentChanges);

module.exports = router;
