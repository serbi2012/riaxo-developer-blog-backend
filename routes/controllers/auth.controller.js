const ENV_VAR = require("../../config/environmentVariable");
const jwt = require("jwt-simple");

exports.validateAuth = async (req, res, next) => {
    try {
        const userRole = req.user.id === ENV_VAR.ADMIN_ID ? "admin" : "guest";
        const payload = {
            id: req.user.id,
            username: req.user.username,
            role: userRole,
        };
        const token = jwt.encode(payload, ENV_VAR.JWT_SECRET);

        res.send({ token: token, userData: req.user, role: userRole });
    } catch (err) {
        next(err);
    }
};
