const { OpenAI } = require("openai");
const axios = require("axios");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ENV_VAR = require("../../config/environmentVariable");

/**
 * 환경 변수를 사용하여 S3 클라이언트를 생성.
 *
 * @type {S3Client}
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/s3client.html
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/s3configuration.html
 */
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

/**
 * 이미지를 업로드하는 함수.
 * S3에 이미지를 업로드하고 업로드된 이미지의 경로를 반환.
 *
 * @param {Buffer} buffer - 업로드할 이미지의 데이터
 * @param {string} fileName - 업로드할 이미지의 파일명
 * @param {string} contentType - 업로드할 이미지의 MIME 타입
 * @returns {Promise<string>} 업로드된 이미지의 경로를 반환하는 Promise 객체
 */
const uploadToS3 = async (buffer, fileName, contentType) => {
    const bucketName = "kim-tae-seop-bucket";
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
};

/**
 * 이미지를 업로드하는 API 엔드포인트.
 * 이미지를 업로드하고 업로드된 이미지의 경로를 반환.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
exports.uploadImage = async (req, res, next) => {
    try {
        res.send({ data: { path: req.file.location } });
    } catch (err) {
        next(err);
    }
};

/**
 * 이미지를 AI로 생성하는 API 엔드포인트.
 * 이미지를 생성하고 생성된 이미지의 경로를 반환.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
exports.createAiImage = async (req, res, next) => {
    try {
        const prompt = req.body.params.content;
        const defaultPrompt =
            "Create a clean, simple image in the illustrator style. And I wish it was 3D style. And I hope it's in an isometric style. Don't draw in English. Don't draw English because it breaks you. And I like simple and simple designs rather than complex ones. I emphasize once again, do not draw in English. Don't make English.";
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `${prompt} ${defaultPrompt}`,
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
