const ENV_VAR = require("../../config/environmentVariable");
const Post = require("../../models/Post");
const Tag = require("../../models/Tag");
const axios = require("axios");
const cheerio = require("cheerio");

async function generateSummary(content, title, summaryCount = 2) {
    const response = await axios({
        method: "POST",
        url: "https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize",
        headers: {
            "X-NCP-APIGW-API-KEY-ID": ENV_VAR?.NAVER_CLIENT_ID,
            "X-NCP-APIGW-API-KEY": ENV_VAR?.NAVER_CLIENT_SECRET,
        },
        data: {
            document: {
                title: title,
                content: content,
            },
            option: {
                language: "ko",
                model: "general",
                tone: 2,
                summaryCount: summaryCount,
            },
        },
    });

    return response?.data?.summary;
}

exports.getPostList = async (req, res, next) => {
    try {
        let query = {};

        if (req.query._id) {
            query._id = req.query._id;
        }

        if (req.query.tags) {
            const tags = req.query.tags.split(",");
            query.tags = { $in: tags };
        }

        if (req.query.title) {
            query.title = { $regex: req.query.title, $options: "i" };
        }

        const sortOptions = { createdAt: -1 };

        const allDocuments = await Post.find(query).sort(sortOptions).exec();

        res.send({ data: allDocuments });
    } catch (err) {
        next(err);
    }
};

exports.getNextPostList = async (req, res, next) => {
    try {
        console.log("exports.getNextPostList= ~ req.query:", req.query);
        const lastId = req.query._id;
        const limit = parseInt(req.query.limit, 10) || 10;

        if (!lastId) {
            return res.status(400).send({ message: "Missing parameter: _id" });
        }

        const query = { _id: { $gt: lastId } };
        const sortOptions = { _id: 1 };

        const posts = await Post.find(query).sort(sortOptions).limit(limit).exec();

        res.send({ data: posts });
    } catch (err) {
        next(err);
    }
};

exports.getPrevPostList = async (req, res, next) => {
    try {
        const lastId = req.query._id;
        const limit = parseInt(req.query.limit, 10) || 10;

        if (!lastId) {
            return res.status(400).send({ message: "Missing parameter: _id" });
        }

        const query = { _id: { $lt: lastId } };
        const sortOptions = { _id: -1 };

        const posts = await Post.find(query).sort(sortOptions).limit(limit).exec();

        res.send({ data: posts.reverse() });
    } catch (err) {
        next(err);
    }
};

exports.createPost = async (req, res, next) => {
    const $ = await cheerio.load(req.body.params.content);
    const textContent = $.text();

    let combinedSummary;

    try {
        const chunkSize = 1800;
        const chunks = [];
        for (let i = 0; i < textContent.length; i += chunkSize) {
            const chunk = textContent.slice(i, i + chunkSize);
            chunks.push(chunk);
        }

        const summaryContents = [];

        for (const chunk of chunks) {
            const summaryContent = await generateSummary(chunk, req.body.params.title);
            summaryContents.push(summaryContent);
        }

        combinedSummary = await generateSummary(summaryContents.join(" "), req.body.params.title, 1);
    } catch (error) {
        combinedSummary = textContent.slice(0, 300);
    }

    try {
        const body = {
            title: req.body.params.title,
            content: req.body.params.content,
            summaryContent: combinedSummary,
            tags: req.body.params.tags,
            thumbnailURL: req.body.params.thumbnailURL,
        };

        const tagsFromRequest = req.body.params.tags;
        const existingTags = await Tag.find({ value: { $in: tagsFromRequest } });
        const existingTagValues = existingTags.map((tag) => tag.value);
        const newTags = tagsFromRequest.filter((tagValue) => !existingTagValues.includes(tagValue));

        if (newTags.length > 0) {
            const newTagDocuments = newTags.map((tagValue) => ({ value: tagValue }));
            await Tag.insertMany(newTagDocuments);
        }

        await Post.create(body);

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};

exports.updatePost = async (req, res, next) => {
    const $ = await cheerio.load(req.body.params.content);
    const textContent = $.text();

    let combinedSummary;

    try {
        const chunkSize = 1800;
        const chunks = [];
        for (let i = 0; i < textContent.length; i += chunkSize) {
            const chunk = textContent.slice(i, i + chunkSize);
            chunks.push(chunk);
        }

        const summaryContents = [];

        for (const chunk of chunks) {
            const summaryContent = await generateSummary(chunk, req.body.params.title);
            summaryContents.push(summaryContent);
        }

        combinedSummary = await generateSummary(summaryContents.join(" "), req.body.params.title, 1);
    } catch (error) {
        combinedSummary = textContent.slice(0, 300);
    }

    try {
        const postId = req.body.params.id;
        const body = {
            title: req.body.params.title,
            content: req.body.params.content,
            summaryContent: combinedSummary,
            tags: req.body.params.tags,
            thumbnailURL: req.body.params.thumbnailURL,
        };

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }

        const existingPostTags = post.tags || [];
        const tagsFromRequest = req.body.params.tags;
        const existingTags = await Tag.find({ value: { $in: tagsFromRequest } });
        const existingTagValues = existingTags.map((tag) => tag.value);
        const newTags = tagsFromRequest.filter((tagValue) => !existingTagValues.includes(tagValue));

        if (newTags.length > 0) {
            const newTagDocuments = newTags.map((tagValue) => ({ value: tagValue }));

            await Tag.insertMany(newTagDocuments);
        }

        await Post.findByIdAndUpdate(postId, body, { new: true });

        const removedTags = existingPostTags.filter((tagValue) => !tagsFromRequest.includes(tagValue));

        for (const tagValue of removedTags) {
            const isTagUsed = await Post.findOne({ tags: tagValue, _id: { $ne: postId } });

            if (!isTagUsed) {
                await Tag.findOneAndDelete({ value: tagValue });
            }
        }

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.query._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send({ message: "Post not found" });
        }

        const tagsToRemove = post.tags || [];

        await Post.findByIdAndDelete(postId);

        for (const tagValue of tagsToRemove) {
            const isTagUsed = await Post.findOne({ tags: tagValue });

            if (!isTagUsed) {
                await Tag.findOneAndDelete({ value: tagValue });
            }
        }

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};
