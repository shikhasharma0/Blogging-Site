const express = require('express');
const router = express.Router();
const AuthorController = require("../controllers/authorController");
const BlogController = require("../controllers/blogController");
const middlewares = require('../middlewares/auth');

router.post("/author",AuthorController.createAuthor);
router.post("/login",AuthorController.login);
router.post("/blogs",middlewares.authenticate,BlogController.createBlogs);
router.get("/blogs",middlewares.authorise,BlogController.getBlogs);
router.put("/blogs/:blogId",middlewares.authorise,BlogController.updateBlog);
router.delete("/blogs/:blogId",middlewares.authorise,BlogController.deleteBlogById);
router.delete("/blogs",middlewares.authenticate,BlogController.deleteBlog);

module.exports = router;


