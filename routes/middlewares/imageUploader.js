const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const ENV_VAR = require("../../config/environmentVariable");

// Cloudinary 설정
cloudinary.config({
  cloud_name: ENV_VAR?.CLOUDINARY_CLOUD_NAME,
  api_key: ENV_VAR?.CLOUDINARY_API_KEY,
  api_secret: ENV_VAR?.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage 설정
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const uploadDirectory = req.query.directory || "uploads";
    
    return {
      folder: `riaxo-blog/${uploadDirectory}`,
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      public_id: `${Date.now()}_${file.originalname.split('.')[0]}`,
      resource_type: "auto",
    };
  },
});

const imageUploader = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  },
  fileFilter: (req, file, callback) => {
    // 이미지 파일만 허용
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(new Error("이미지 파일만 업로드 가능합니다."), false);
    }
  },
});

module.exports = imageUploader;
