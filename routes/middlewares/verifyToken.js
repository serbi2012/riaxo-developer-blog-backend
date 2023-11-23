const jwt = require("jsonwebtoken");
const ENV_VAR = require("./../../config/environmentVariable");

const verifyTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, ENV_VAR.JWT_SECRET, (err, user) => {
            req.user = err ? "error" : user;
            next();
        });
    } else {
        res.sendStatus(401); // 인증 헤더 없음
    }
};

module.exports = verifyTokenMiddleware;
