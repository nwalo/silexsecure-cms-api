const BlogPost = require("../../models/blogPost");
const Media = require("../mediaController/media");
const User = require("../../models/user");
const notificationController = require("../notificationController/notification");

const createBlogPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unathorized action" });
    }
    // Save image
    const saveMedia = await Media.createMedia(req, res, (reuse = true));

    // Save post
    if (saveMedia.statusCode === 201) {
      const findBlogPost = await BlogPost.findOne({ title: req.body.title });
      if (findBlogPost) {
        return res.status(400).json({ message: "BlogPost already exist" });
      } else {
        const blogPost = new BlogPost({
          title: req.body.title,
          image: req.body.image,
          content: req.body.content,
          tags: req.body.tags,
          metadata: req.body.metadata,
          createdBy: req.user._id,
        });

        let result = await blogPost.save();

        res.status(200).json({
          message: "BlogPost has been created.",
          data: result,
        });
        const findUser = await User.findOne({ _id: req?.user?._id });
        const notif = {
          title: "Blog Created",
          description: `A new blog titled ${req.body.title} was created by ${findUser?.fullName}`,
        };
        notificationController.createNotification(notif);
      }
    } else {
      res.status(400).json({ message: "Error... can not save image" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: "Unathorized action" });
    }

    const saveMedia = await Media.createMedia(req, res, (reuse = true));

    // Save post
    if (saveMedia.statusCode === 201) {
      const result = await BlogPost.findOneAndUpdate(
        { _id: postId },
        req.body,
        {
          new: true,
        }
      );

      if (result) {
        const findUser = await User.findOne({ _id: req?.user?._id });
        const notif = {
          title: "Blog Updated",
          description: `Blog titled ${result?.title} was updated by ${findUser?.fullName}`,
        };
        notificationController.createNotification(notif);
        return res.status(200).json({
          message: "BlogPost has been updated.",
          data: result,
        });
      } else {
        return res.status(400).json({ message: "Could not find blog." });
      }
    } else {
      res.status(400).json({ message: "Error... can not save image" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const getBlogPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await BlogPost.findOne({ _id: postId })
      .populate("tags")
      .populate("createdBy");

    res.status(200).json({
      message: "post found.",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, error: "Internal server error" });
  }
};

const getBlogPosts = async (req, res) => {
  try {
    const pages = await BlogPost.find({})
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

const deleteBlogPost = async (req, res) => {
  try {
    const { postId } = req.params;

    await BlogPost.deleteOne({ _id: postId });
    const pages = await BlogPost.find({});
    res.status(200).json({
      message: "page has been deleted.",
      data: pages,
    });
  } catch (error) {
    res.status(500).json({ message: error, error: "Internal server error" });
  }
};

module.exports = {
  createBlogPost,
  deleteBlogPost,
  getBlogPosts,
  getBlogPost,
  updateBlogPost,
};
