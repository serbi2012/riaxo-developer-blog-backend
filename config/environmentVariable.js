require("dotenv").config();

const ENV_VAR = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
};

module.exports = ENV_VAR;
