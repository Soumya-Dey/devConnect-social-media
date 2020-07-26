const multer = require("multer");

const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/gif"
        )
            cb(null, true);
        else cb("only images are accepted", false);
    },
});

module.exports = uploader;
