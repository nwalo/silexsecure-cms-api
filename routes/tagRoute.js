const express = require("express");
const router = express.Router();

const tagController = require("../controllers/tagController/tag");

router.route("/").post(tagController.createTag);
router.route("/").get(tagController.getTags);
router.route("/:tagId").delete(tagController.deleteTag);

module.exports = router;
