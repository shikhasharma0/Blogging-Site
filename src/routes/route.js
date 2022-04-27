const express = require('express');
const router = express.Router();
const AuthorController = require("../controllers/authorController")
const BlogController = require("../controllers/blogController")

//Author-Blog route Handlers
router.post("/author", AuthorController.createAuthor)
router.post("/blogs", BlogController.createBlogs)
router.get("/blogs", BlogController.getBlogs)
router.put("/blogs/:blogId", BlogController.updateBlog)
router.delete("/blogs/:blogId", BlogController.deleteBlogById)
router.delete("/blogs", BlogController.deleteBlog)

module.exports = router;


