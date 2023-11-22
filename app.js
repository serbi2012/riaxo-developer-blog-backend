const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const imageRouter = require("./routes/image");

const mongoDBConnect = require("./config/mongoDbConnect");
const ENV_VAR = require("./config/environmentVariable");
const { errorHandler } = require("./config/errorHandler");

const app = express();

mongoDBConnect(ENV_VAR.DB_URI);

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/post", postRouter);
app.use("/image", imageRouter);

app.use(errorHandler);

module.exports = app;
