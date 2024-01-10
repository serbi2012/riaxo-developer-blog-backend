const ENV_VAR = require("../../config/environmentVariable");
const jwt = require("jsonwebtoken");
const Token = require("../../models/Token");

/**
 * 사용자 인증을 검증하고 토큰을 발급하는 API 엔드포인트.
 * 요청에서 인증된 사용자 정보를 기반으로 액세스 토큰과 리프레시 토큰을 생성하고 반환.
 * 관리자 사용자의 경우 'admin' 역할을 할당하고, 그렇지 않은 경우 'guest' 역할을 할당.
 *
 * @param {object} req - Express의 요청 객체. 인증된 사용자 정보가 포함되어야함.
 * @param {object} res - Express의 응답 객체. 발급된 토큰과 사용자 데이터를 포함하여 응답.
 * @param {function} next - 다음 미들웨어 함수.
 */
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

/**
 * 사용자 정보를 조회하는 API 엔드포인트.
 * 사용자 정보를 반환.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
exports.getUserInfo = async (req, res, next) => {
    try {
        res.send({ user: req?.user === "error" ? { role: "error" } : req?.user });
    } catch (err) {
        next(err);
    }
};

/**
 * 액세스 토큰을 새로고침하는 API 엔드포인트.
 * 요청 본문에서 제공된 리프레시 토큰을 검증하고, 유효한 경우 새로운 액세스 토큰을 발급.
 *
 * @param {object} req - Express의 요청 객체. 리프레시 토큰을 포함해야 함.
 * @param {object} res - Express의 응답 객체. 새로운 액세스 토큰을 포함하여 응답.
 * @param {function} next - 다음 미들웨어 함수.
 */
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
