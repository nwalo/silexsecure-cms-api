const express = require("express");
const router = express.Router();

const pageController = require("../controllers/pageController/page");

router.route("/").post(pageController.createPage);
router.route("/:pageId").get(pageController.getPage);
router.route("/pages/all").get(pageController.getPages);
router.route("/:pageId").delete(pageController.deletePage);

module.exports = router;
