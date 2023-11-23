const ENV_VAR = require("../../config/environmentVariable");
const jwt = require("jsonwebtoken");

exports.validateAuth = async (req, res, next) => {
    try {
        const userRole = req.user.id === ENV_VAR.ADMIN_ID ? "admin" : "guest";
        const payload = {
            id: req.user.id,
            username: req.user.username,
            role: userRole,
        };
        const token = jwt.sign(payload, ENV_VAR.JWT_SECRET, { expiresIn: "1h" });

        res.send({ token: token, userData: req.user, role: userRole });
    } catch (err) {
        next(err);
    }
};

exports.getUserInfo = async (req, res, next) => {
    try {
        res.send({ user: req?.user === "error" ? { role: "error" } : req?.user });
    } catch (err) {
        next(err);
    }
};
