const { OpenAI } = require("openai");
const axios = require("axios");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ENV_VAR = require("../../config/environmentVariable");

const s3 = new S3Client({
    region: "ap-northeast-2",
    credentials: {
        accessKeyId: ENV_VAR?.ACCESS_KEY_ID,
        secretAccessKey: ENV_VAR?.SECRET_ACCESS_KEY,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
});

const openai = new OpenAI({ apiKey: ENV_VAR?.OPENAI_API_KEY });

async function uploadToS3(buffer, fileName, contentType) {
    const bucketName = "riaxo-bucket";
    const key = `uploads/${uuidv4()}_${fileName}`;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: "public-read-write",
    });

    await s3.send(command);

    return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

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

        const imageUrl = response.data?.[0].url;
        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

        let buffer = Buffer.from(imageResponse.data, "binary");

        buffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();

        const fileName = `ai-thumbnail-${new Date().toISOString()}.jpg`;
        const fileLocation = await uploadToS3(buffer, fileName, "image/jpeg");

        res.send({ imageUrl: fileLocation });
    } catch (err) {
        next(err);
    }
};
