const Media = require("../../models/media");
const User = require("../../models/user");
const notificationController = require("../notificationController/notification");

const createMedia = async (req, res, reuse) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unathorized action" });
    }

    const { fileName, url, fileType, fileSize, image } = req.body;
    const findMedia = await Media.findOne({
      title: `${fileName}_${fileType}_${fileSize}`,
    });

    if (findMedia) {
      return reuse === true
        ? { statusCode: 201 }
        : res.status(200).json({
            message: "media already exist.",
          });
    } else {
      const media = new Media({
        title: `${fileName}_${fileType}_${fileSize}`,
        fileSize,
        url: url ? url : image,
        fileType,
        fileName,
        createdBy: req.user._id,
      });

      const findUser = await User.findOne({ _id: req?.user?._id });
      const notif = {
        title: "Media uploaded",
        description: `New media doc (${fileType}) was uploaded by ${findUser?.fullName}`,
      };
      notificationController.createNotification(notif);

      const newMedia = await media.save();
      return reuse === true
        ? { statusCode: 201 }
        : res.status(201).json({ message: "Media created", data: newMedia });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

const getMedias = async (req, res, reuse) => {
  try {
    const findMedia = await Media.find({});

    if (findMedia) {
      return res.status(200).json({
        message: "media found.",
        data: findMedia,
      });
    } else {
      res.status(400).json({ message: "Cannot find media" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deleteMedia = async (req, res, reuse) => {
  try {
    const { mediaId } = req.params;

    await Media.deleteOne({ _id: mediaId });
    const media = await Media.find({});
    res.status(200).json({
      message: "media has been deleted.",
      data: media,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = { createMedia, deleteMedia, getMedias };
