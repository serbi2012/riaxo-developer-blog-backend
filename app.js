const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const passport = require("passport");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const tagRouter = require("./routes/tag");
const imageRouter = require("./routes/image");

const mongoDBConnect = require("./config/mongoDbConnect");
const ENV_VAR = require("./config/environmentVariable");
const { errorHandler } = require("./config/errorHandler");
const passportConfig = require("./config/passportConfig");

const app = express();

mongoDBConnect(ENV_VAR.DB_URI);

app.use(express.json());
app.use(passport.initialize());
passportConfig();

// CORS 설정 - Vercel Preview URLs와 Production URL 모두 허용
const cors_options = {
    origin: function (origin, callback) {
        // Origin이 없는 경우 (모바일 앱, Postman 등) 허용
        if (!origin) return callback(null, true);
        
        const allowed_origins = ENV_VAR.FRONTEND_URL ? ENV_VAR.FRONTEND_URL.split(',') : [];
        
        // Vercel Preview URLs 패턴 매칭
        const is_vercel_preview = origin.includes('vercel.app');
        const is_allowed = allowed_origins.some(allowed => origin === allowed.trim());
        
        if (is_allowed || is_vercel_preview) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(cors_options));

app.use(logger(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/tag", tagRouter);
app.use("/api/image", imageRouter);

app.use(errorHandler);

module.exports = app;
