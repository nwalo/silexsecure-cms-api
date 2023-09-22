const ArticlePost = require("../../models/articlePost");
const Media = require("../mediaController/media");
const User = require("../../models/user");
const notificationController = require("../notificationController/notification");

const createArticlePost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unathorized action" });
    }
    // Save image
    const saveMedia = await Media.createMedia(req, res, (reuse = true));

    // Save post
    if (saveMedia.statusCode === 201) {
      const findArticlePost = await ArticlePost.findOne({
        title: req.body.title,
      });
      if (findArticlePost) {
        return res.status(400).json({ message: "ArticlePost already exist" });
      } else {
        const articlePost = new ArticlePost({
          title: req.body.title,
          image: req.body.image,
          content: req.body.content,
          tags: req.body.tags,
          metadata: req.body.metadata,
          createdBy: req.user._id,
        });

        let result = await articlePost.save();

        res.status(200).json({
          message: "ArticlePost has been created.",
          data: result,
        });

        const findUser = await User.findOne({ _id: req?.user?._id });
        const notif = {
          title: "Article Created",
          description: `A new article titled ${req.body.title} was created by ${findUser?.fullName}`,
        };
        notificationController.createNotification(notif);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
const updateArticlePost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: "Unathorized action" });
    }

    const saveMedia = await Media.createMedia(req, res, (reuse = true));

    // Save post
    if (saveMedia.statusCode === 201) {
      const result = await ArticlePost.findOneAndUpdate(
        { _id: postId },
        req.body,
        {
          new: true,
        }
      );

      if (result) {
        const findUser = await User.findOne({ _id: req?.user?._id });
        const notif = {
          title: "Article Updated",
          description: `Article titled ${result.title} was updated by ${findUser?.fullName}`,
        };
        notificationController.createNotification(notif);
        return res.status(200).json({
          message: "ArticlePost has been updated.",
          data: result,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Could not find and update article." });
      }
    } else {
      res.status(400).json({ message: "Error... can not save image" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const getArticlePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await ArticlePost.findOne({ _id: postId })
      .populate("createdBy")
      .populate("tags");

    res.status(200).json({
      message: "post found.",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ message: error, error: "Internal server error" });
  }
};

const getArticlePosts = async (req, res) => {
  try {
    const pages = await ArticlePost.find({})
      .populate("createdBy")
      .populate("tags");
    res.status(200).json({
      message: "pages found.",
      data: pages,
    });
  } catch (error) {
    res.status(500).json({ message: error, error: "Internal server error" });
  }
};

const deleteArticlePost = async (req, res) => {
  try {
    const { postId } = req.params;

    await ArticlePost.deleteOne({ _id: postId });
    const pages = await ArticlePost.find({});
    res.status(200).json({
      message: "page has been deleted.",
      data: pages,
    });
  } catch (error) {
    res.status(500).json({ message: error, error: "Internal server error" });
  }
};

module.exports = {
  createArticlePost,
  deleteArticlePost,
  getArticlePosts,
  getArticlePost,
  updateArticlePost,
};
