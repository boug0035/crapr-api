const multer = require("multer");
const { ImageUploadError } = require("../utils/errors");

const storage = multer.memoryStorage();

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new ImageUploadError("File is not an image"), false);
  }
  cb(null, true);
};

const attachImages = multer({
  storage,
  limits,
  fileFilter,
}).array("images", 10);

module.exports = attachImages;
