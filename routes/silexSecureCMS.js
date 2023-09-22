const express = require("express");
const router = express.Router();
const cmsController = require("../controllers/cmsController");

router.route("/").get(cmsController);
module.exports = router;
