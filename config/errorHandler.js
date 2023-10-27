const errorMessage = require("../constant/errorMessage");

function notFoundError(req, res, next) {
  const err = new Error(errorMessage.NOT_FOUND);

  err.status = 404;

  next(err);
}

function errorHandler(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
}

module.exports = { notFoundError, errorHandler };
