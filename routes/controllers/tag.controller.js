const Tag = require("../../models/Tag");

/**
 * 태그 목록을 조회하는 API 엔드포인트.
 * 태그 목록을 반환.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
exports.getTagList = async (req, res, next) => {
    try {
        const sortOptions = { createdAt: -1 };

        const allTags = await Tag.find({}).sort(sortOptions).exec();

        res.send({ data: allTags });
    } catch (err) {
        next(err);
    }
};

/**
 * 새로운 태그를 생성하는 API 엔드포인트.
 * 요청 본문에서 제공된 정보를 기반으로 태그를 생성.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
exports.createTag = async (req, res, next) => {
    try {
        const body = { value: req.body.params.value };

        await Tag.create(body);

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};

/**
 * 태그를 수정하는 API 엔드포인트.
 * 요청 본문에서 제공된 정보를 기반으로 태그를 수정.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
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

/**
 * 태그를 삭제하는 API 엔드포인트.
 * 요청 본문에서 제공된 정보를 기반으로 태그를 삭제.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
exports.deleteTag = async (req, res, next) => {
    try {
        const postId = req.query._id;

        await Tag.findByIdAndDelete(postId);

        res.send({ data: {} });
    } catch (err) {
        next(err);
    }
};
