const GoogleTagManager = require("../../models/googleTagManager");
const User = require("../../models/user");
const notificationController = require("../notificationController/notification");

const submitGoogleTagManager = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unathorized action" });
    }

    const updateTag = await GoogleTagManager.findOneAndUpdate(
      {},
      { tagId: req.body.tagId, createdBy: req.user._id },
      {
        new: true,
      }
    );

    if (updateTag) {
      res.status(200).json({
        message: "Google tag manager id updated.",
        data: updateTag,
      });
    } else {
      const googleTag = await GoogleTagManager.create({
        tagId: req.body.tagId,
        createdBy: req.user._id,
      });

      googleTag
        ? res.status(200).json({
            message: "Google tag manager id created.",
            data: googleTag,
          })
        : res.status(400).json({
            message: "Unable to submit google tag manager id.",
          });
    }

    const findUser = await User.findOne({ _id: req?.user?._id });
    const notif = {
      title: "Google tag manager ID Updated",
      description: `Google tag ID was updated by ${findUser?.fullName}`,
    };
    notificationController.createNotification(notif);
  } catch (error) {
    res.status(500).json({ message: error, error: "internal server error." });
  }
};

const getGoogleTagManager = async (req, res) => {
  try {
    const found = await GoogleTagManager.findOne({}).populate("createdBy");

    if (found) {
      res.status(200).json({
        message: "Google tag manager id created.",
        data: found,
      });
    } else {
      res.status(400).json({
        message: "Unable to submit google tag manager id.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error, error: "internal server error." });
  }
};

module.exports = {
  submitGoogleTagManager,
  getGoogleTagManager,
};
