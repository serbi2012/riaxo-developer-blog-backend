const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../Frontend/build/index.html"), {
        user: req.user,
    });
});

module.exports = router;
