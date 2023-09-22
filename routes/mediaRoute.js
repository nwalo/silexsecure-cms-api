const express = require("express");
const router = express.Router();

const mediaController = require("../controllers/mediaController/media");

router.route("/").post(mediaController.createMedia);
// router.route("/:mediaId").get(mediaController.getMedia);
router.route("/medias/all").get(mediaController.getMedias);
router.route("/:mediaId").delete(mediaController.deleteMedia);

module.exports = router;
