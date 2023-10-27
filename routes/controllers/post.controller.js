const ENV_VAR = require("../../config/environmentVariable");
const Post = require("../../models/Post");
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
        const query = { ...(req?.query._id && { _id: req?.query._id }) };
        const sortOptions = { createdAt: -1 };

        const allDocuments = await Post.find(query).sort(sortOptions).exec();

        res.send({ data: allDocuments });
    } catch (err) {
        next(err);
    }
};

exports.createPost = async (req, res, next) => {
    try {
        const $ = await cheerio.load(req.body.params.content);
        const textContent = $.text();

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

        const combinedSummary = await generateSummary(summaryContents.join(" "), req.body.params.title, 1);

        const body = {
            title: req.body.params.title,
            content: req.body.params.content,
            summaryContent: combinedSummary,
            tags: req.body.params.tags,
        };

        await Post.create(body);

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        const $ = await cheerio.load(req.body.params.content);
        const textContent = $.text();

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

        const combinedSummary = await generateSummary(summaryContents.join(" "), req.body.params.title, 1);

        const postId = req.body.params.id;
        const body = {
            title: req.body.params.title,
            content: req.body.params.content,
            summaryContent: combinedSummary,
            tags: req.body.params.tags,
        };

        await Post.findByIdAndUpdate(postId, body);

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.query._id;

        await Post.findByIdAndDelete(postId);

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};
