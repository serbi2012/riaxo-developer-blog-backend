require("dotenv").config();

const ENV_VAR = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
};

module.exports = ENV_VAR;
