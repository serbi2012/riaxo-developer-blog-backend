const express = require("express");
const postController = require("./controllers/post.controller");

const router = express.Router();

router.get("/", postController.getPostList);
router.post("/create", postController.createPost);
router.patch("/update", postController.updatePost);
router.delete("/delete", postController.deletePost);

module.exports = router;
