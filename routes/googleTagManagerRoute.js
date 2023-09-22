const express = require("express");
const router = express.Router();

const googleTagManagerController = require("../controllers/googleTagManagerController/googleTagManager");
const { verify } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(verify, googleTagManagerController.submitGoogleTagManager);
router.route("/").get(googleTagManagerController.getGoogleTagManager);

module.exports = router;
