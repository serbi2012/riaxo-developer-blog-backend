const express = require("express");
const authController = require("./controllers/auth.controller");
const passport = require("passport");
const verifyTokenMiddleware = require("./middlewares/verifyToken");

const router = express.Router();

router.get("/github", passport.authenticate("github", { session: false }), authController.validateAuth);
router.get("/user-info", verifyTokenMiddleware, authController.getUserInfo);
router.post("/refresh", authController.refreshAccessToken);

module.exports = router;
