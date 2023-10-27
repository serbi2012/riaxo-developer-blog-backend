const express = require("express");
const imageController = require("./controllers/image.controller");
const imageUploader = require("./middlewares/imageUploader");

const router = express.Router();

router.post("/upload", imageUploader.single("image"), imageController.uploadImage);

module.exports = router;
