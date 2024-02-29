const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");

// Load environment variables from .env file
require('dotenv').config();

// Create S3 client instance
const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'us-west-1'
});

// Configure multerS3 storage for image upload
const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    // acl: "public-read",
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname });
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

// Function to sanitize files and send error for unsupported files
const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        const fileExts = [".png", ".jpg", ".jpeg", ".gif"];
        const isAllowedExt = fileExts.includes(path.extname(file.originalname.toLowerCase()));
        const isAllowedMimeType = file.mimetype.startsWith("image/");
        if (isAllowedExt && isAllowedMimeType) {
            return callback(null, true);
        } else {
            callback("Error: File type not allowed!");
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 10 // 2MB file size limit
    }
});

module.exports = uploadImage;