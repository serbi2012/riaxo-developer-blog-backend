const express = require("express");
const tagController = require("./controllers/tag.controller");

const router = express.Router();

router.get("/", tagController.getTagList);
router.post("/create", tagController.createTag);
router.patch("/update", tagController.updateTag);
router.delete("/delete", tagController.deleteTag);

module.exports = router;
