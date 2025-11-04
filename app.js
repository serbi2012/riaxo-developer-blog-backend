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

// CORS 설정 - 프로덕션 환경에서는 특정 도메인만 허용
const cors_options = {
    origin: ENV_VAR.FRONTEND_URL || "*",
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
