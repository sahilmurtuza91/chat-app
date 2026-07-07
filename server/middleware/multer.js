// this is for saving the image or video in local folder and this is rplace bacause of cloudinary uses 

// const multer = require("multer");

// const path = require("path");
// const fs = require("fs");

// // upload folders
// const imagePath = path.join(__dirname, "../uploads/images");
// const videoPath = path.join(__dirname, "../uploads/videos");

// // Create folders if they don't exist
// if (!fs.existsSync(imagePath)) {
//     fs.mkdirSync(imagePath, { recursive: true });
// }

// if (!fs.existsSync(videoPath)) {
//     fs.mkdirSync(videoPath, { recursive: true });
// }

// // storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {

//         // this is for the image uploads
//         if (file.mimetype.startsWith("image")) {
//             return cb(null, imagePath);
//         }
//         // this is for the video uploads
//         if (file.mimetype.startsWith("video")) {
//             return cb(null, videoPath);
//         }

//         return cb(new Error("Unsupported file type"), false);
//     },
//     filename: function (req, file, cb) {
//         const uniqueName = Date.now() + "-" + file.originalname;
//         cb(null, uniqueName);
//     }
// })


// // file validation
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "image/webp",
//         "image/gif",
//         "video/mp4",
//     ]
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("only image and video file are allowed"), false);
//     }
// }

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//         fileSize: 20 * 1024 * 1024 // 20MB
//     }
// });

// module.exports = upload;


// for cloudinary upload
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith("image");

        return {
            folder: isImage
                ? "chat-app/images"
                : "chat-app/videos",

            resource_type: "auto",

            // Optional: filename readable rahe
            public_id: `${Date.now()}-${file.originalname
                .split(".")[0]
                .replace(/\s+/g, "-")}`,
        };
    },
});

// File Validation
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed."), false);
    }
};

// Upload Middleware
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
    },
});

module.exports = upload;