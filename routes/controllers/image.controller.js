exports.uploadImage = async (req, res, next) => {
    try {
        res.send({ data: { path: req.file.location } });
    } catch (err) {
        next(err);
    }
};
