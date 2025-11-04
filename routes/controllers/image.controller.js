const { OpenAI } = require("openai");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ENV_VAR = require("../../config/environmentVariable");

/**
 * Cloudinary 설정
 * 환경 변수를 사용하여 Cloudinary 클라이언트를 초기화
 * 
 * @see https://cloudinary.com/documentation/node_integration
 */
cloudinary.config({
  cloud_name: ENV_VAR?.CLOUDINARY_CLOUD_NAME,
  api_key: ENV_VAR?.CLOUDINARY_API_KEY,
  api_secret: ENV_VAR?.CLOUDINARY_API_SECRET,
});

const openai = new OpenAI({ apiKey: ENV_VAR?.OPENAI_API_KEY });

/**
 * 이미지를 업로드하는 함수.
 * Cloudinary에 이미지를 업로드하고 업로드된 이미지의 URL을 반환.
 *
 * @param {Buffer} buffer - 업로드할 이미지의 데이터
 * @param {string} fileName - 업로드할 이미지의 파일명
 * @param {string} contentType - 업로드할 이미지의 MIME 타입
 * @returns {Promise<string>} 업로드된 이미지의 URL을 반환하는 Promise 객체
 */
const uploadToCloudinary = async (buffer, fileName, contentType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "riaxo-blog/ai-generated",
        public_id: `${uuidv4()}_${fileName.split('.')[0]}`,
        resource_type: "auto",
        format: "jpg",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    
    uploadStream.end(buffer);
  });
};

/**
 * 이미지를 업로드하는 API 엔드포인트.
 * Cloudinary를 통해 이미지를 업로드하고 업로드된 이미지의 URL을 반환.
 *
 * @param {object} req - Express의 요청 객체
 * @param {object} res - Express의 응답 객체
 * @param {function} next - 다음 미들웨어 함수
 */
exports.uploadImage = async (req, res, next) => {
  try {
    // Cloudinary에서는 req.file.path에 업로드된 이미지 URL이 저장됨
    res.send({ data: { path: req.file.path } });
  } catch (err) {
    next(err);
  }
};

/**
 * 이미지를 AI로 생성하는 API 엔드포인트.
 * OpenAI DALL-E를 사용하여 이미지를 생성하고 Cloudinary에 업로드.
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

    // Sharp로 이미지 최적화
    buffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer();

    const fileName = `ai-thumbnail-${new Date().toISOString()}.jpg`;
    const fileLocation = await uploadToCloudinary(buffer, fileName, "image/jpeg");

    res.send({ imageUrl: fileLocation });
  } catch (err) {
    next(err);
  }
};
