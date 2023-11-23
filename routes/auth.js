const express = require("express");
const authController = require("./controllers/auth.controller");
const passport = require("passport");

const router = express.Router();

router.get("/github", passport.authenticate("github", { session: false }), authController.validateAuth);

module.exports = router;
