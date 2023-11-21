const { OpenAI } = require("openai");
const { OPENAI_API_KEY } = require("../../config/environmentVariable");

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

exports.uploadImage = async (req, res, next) => {
    try {
        res.send({ data: { path: req.file.location } });
    } catch (err) {
        next(err);
    }
};

exports.createAiImage = async (req, res, next) => {
    try {
        const prompt = req.body.params.content;
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `${prompt} Create a clean, simple image in the illustrator style. And I wish it was 3D style. And I hope it's in an isometric style. Don't draw in English. Don't draw English because it breaks you. And I like simple and simple designs rather than complex ones. I emphasize once again, do not draw in English. Don't make English.`,
            n: 1,
            size: "1792x1024",
        });

        const imageUrl = response.data;
        res.send({ imageUrl: imageUrl });
    } catch (err) {
        next(err);
    }
};
