const ENV_VAR = require("../../config/environmentVariable");
const jwt = require("jsonwebtoken");
const Token = require("../../models/Token");

exports.validateAuth = async (req, res, next) => {
    try {
        const userRole = req.user.id === ENV_VAR.ADMIN_ID ? "admin" : "guest";
        const payload = {
            id: req.user.id,
            username: req.user.username,
            role: userRole,
        };

        const accessToken = jwt.sign(payload, ENV_VAR.JWT_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, ENV_VAR.JWT_REFRESH_SECRET, { expiresIn: "14d" });

        let tokenDoc = await Token.findOne({ userId: req.user.id });

        if (tokenDoc) {
            tokenDoc.refreshToken = refreshToken;
            await tokenDoc.save();
        } else {
            tokenDoc = new Token({
                userId: req.user.id,
                refreshToken: refreshToken,
            });
            await tokenDoc.save();
        }

        res.send({ accessToken, refreshToken, userData: req.user, role: userRole });
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

exports.refreshAccessToken = async (req, res, next) => {
    const refreshToken = req.body.params;

    if (!refreshToken) return res.sendStatus(401);

    try {
        const tokenDoc = await Token.findOne({ refreshToken: refreshToken });

        if (!tokenDoc) return res.sendStatus(403);

        jwt.verify(refreshToken, ENV_VAR.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.sendStatus(403);

            const newAccessToken = jwt.sign(
                { id: decoded.id, username: decoded.username, role: decoded.role },
                ENV_VAR.JWT_SECRET,
                { expiresIn: "1h" },
            );

            res.send({ accessToken: newAccessToken });
        });
    } catch (err) {
        next(err);
    }
};
