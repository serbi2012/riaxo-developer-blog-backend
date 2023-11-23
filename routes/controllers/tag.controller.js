const Tag = require("../../models/Tag");

exports.getTagList = async (req, res, next) => {
    try {
        const sortOptions = { createdAt: -1 };

        const allTags = await Tag.find({}).sort(sortOptions).exec();

        res.send({ data: allTags });
    } catch (err) {
        next(err);
    }
};

exports.createTag = async (req, res, next) => {
    try {
        const body = { value: req.body.params.value };

        await Tag.create(body);

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};

exports.updateTag = async (req, res, next) => {
    try {
        const postId = req.body.params.id;
        const body = { value: req.body.params.value };

        await Tag.findByIdAndUpdate(postId, body);

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};

exports.deleteTag = async (req, res, next) => {
    try {
        const postId = req.query._id;

        await Tag.findByIdAndDelete(postId);

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};
