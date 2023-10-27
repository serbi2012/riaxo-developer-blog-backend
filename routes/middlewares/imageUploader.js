const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
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

const imageUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: "riaxo-bucket",
        acl: "public-read-write",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, callback) => {
            const uploadDirectory = req.query.directory ?? "";
            callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`);
        },
    }),
});

module.exports = imageUploader;
