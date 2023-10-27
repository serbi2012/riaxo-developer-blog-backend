function errorHandler(err, req, res, next) {
    const errorDetails = {
        status: err.status || 500,
        message: err.message,
        route: req.originalUrl,
        method: req.method,
        requestData: req.body,
    };

    console.error(`Error in ${errorDetails.method} ${errorDetails.route}: ${errorDetails.message}`);
    if (req.app.get("env") === "development") {
        console.error(err.stack);
        console.error("Request Data:", errorDetails.requestData);
    }

    res.status(errorDetails.status).json(errorDetails);
}

module.exports = { errorHandler };
