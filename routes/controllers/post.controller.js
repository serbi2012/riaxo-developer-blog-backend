const ENV_VAR = require("../../config/environmentVariable");
const Post = require("../../models/Post");
const Tag = require("../../models/Tag");
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * 게시물 요약을 생성하는 함수.
 * Naver Open API를 사용하여 주어진 컨텐츠와 제목에서 요약문을 생성.
 *
 * @param {string} content - 요약할 컨텐츠 내용
 * @param {string} title - 컨텐츠의 제목
 * @param {number} summaryCount - 생성할 요약문의 수 (기본값: 2)
 * @returns {Promise<string>} 요약문을 반환하는 Promise 객체
 */
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

/**
 * 게시물 목록을 조회하는 API 엔드포인트.
 * 쿼리 매개변수를 기반으로 게시물을 검색하고 결과를 반환.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
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

        let allDocuments = await Post.find(query).sort(sortOptions).exec();

        if (req.query.nextPrevPost) {
            allDocuments = await Promise.all(
                allDocuments.map(async (post) => {
                    const prevPost = await Post.findOne({ _id: { $lt: post._id } })
                        .sort({ _id: -1 })
                        .exec();
                    const nextPost = await Post.findOne({ _id: { $gt: post._id } })
                        .sort({ _id: 1 })
                        .exec();

                    return {
                        ...post.toObject(),
                        prevPost: prevPost ? prevPost.toObject() : null,
                        nextPost: nextPost ? nextPost.toObject() : null,
                    };
                }),
            );
        }

        res.send({ data: allDocuments });
    } catch (err) {
        next(err);
    }
};

/**
 * 새로운 게시물을 생성하는 API 엔드포인트.
 * 요청 본문에서 제공된 정보를 기반으로 게시물을 생성.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
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

/**
 * 기존 게시물을 업데이트하는 API 엔드포인트.
 * 요청 본문에서 제공된 정보를 기반으로 특정 게시물을 업데이트.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
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

/**
 * 게시물을 삭제하는 API 엔드포인트.
 * 쿼리 매개변수로 제공된 게시물 ID를 기반으로 게시물을 삭제.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
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
