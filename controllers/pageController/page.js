const Page = require("../../models/page");
const User = require("../../models/user");
const notificationController = require("../notificationController/notification");

const createPage = async (req, res) => {
  try {
    const findPage = await Page.findOne({ title: req.body.title });
    if (!req.user) {
      return res.status(401).json({ message: "Unathorized action" });
    }

    if (findPage) {
      return res.status(400).json({ message: "page already exist" });
    } else {
      const page = new Page({
        title: req.body.title,
        createdBy: req.user._id,
      });

      let result = await page.save();

      res.status(200).json({
        message: "page has been created.",
        data: result,
      });
      const findUser = await User.findOne({ _id: req?.user?._id });
      const notif = {
        title: "Unique page menu created",
        description: `A new page titled ${req?.body?.title} was updated by ${findUser?.fullName}`,
      };
      notificationController.createNotification(notif);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const getPage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = await Page.findOne({ _id: pageId });
    res.status(200).json({
      message: "page found.",
      data: page,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getPages = async (req, res) => {
  try {
    const pages = await Page.find({});
    res.status(200).json({
      message: "pages found.",
      data: pages,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deletePage = async (req, res) => {
  try {
    const { pageId } = req.params;

    await Page.deleteOne({ _id: pageId });
    const pages = await Page.find({});
    res.status(200).json({
      message: "page has been deleted.",
      data: pages,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  createPage,
  deletePage,
  getPages,
  getPage,
};
