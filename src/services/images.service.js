const { Storage } = require("@google-cloud/storage");
const { ImageUploadError } = require("../utils/errors");

const storage = new Storage({
  keyFilename: process.env.GOOGLE_STORAGE_SECRET_PATH,
});

const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME);

exports.uploadMany = async (files) => {
  try {
    if (!files || files.length === 0)
      throw new ImageUploadError("No images provided for upload");

    const uploadPromises = files.map((file) => {
      const filename = `${Date.now()}-${file.originalname}`;
      const blob = bucket.file(filename);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });

      return new Promise((resolve, reject) => {
        blobStream.on("error", (err) => {
          reject(
            new ImageUploadError(
              `Failed to upload ${file.originalname}: ${err.message}`
            )
          );
        });

        blobStream.on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          resolve(publicUrl);
        });

        blobStream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    if (error instanceof ImageUploadError) {
      throw error;
    } else {
      throw new ImageUploadError(
        `Unexpected error during image upload: ${error.message}`
      );
    }
  }
};
