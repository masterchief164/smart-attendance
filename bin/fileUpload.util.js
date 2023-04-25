const util = require("util");
const multer = require("multer");

const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }

        const filename = `${Date.now()}-bezkoder-${file.originalname}`;
        callback(null, filename);
    }
});

const uploadFiles = multer({ storage: storage }).array("multi-files", 10);
const uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
