const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController/post.js");

//Blogs
router.route("/blog").post(postController.blogPost.createBlogPost);
router.route("/blog/:postId").get(postController.blogPost.getBlogPost);
router.route("/blogs").get(postController.blogPost.getBlogPosts);
router.route("/blog/:postId").delete(postController.blogPost.deleteBlogPost);
router.route("/blog/:postId").put(postController.blogPost.updateBlogPost);

//Articles
router.route("/article").post(postController.articlePost.createArticlePost);
router.route("/article/:postId").get(postController.articlePost.getArticlePost);
router.route("/articles").get(postController.articlePost.getArticlePosts);
router
  .route("/article/:postId")
  .delete(postController.articlePost.deleteArticlePost);
router
  .route("/article/:postId")
  .put(postController.articlePost.updateArticlePost);

module.exports = router;
