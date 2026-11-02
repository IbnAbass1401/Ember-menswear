import multer from "multer";
import AppError from "../utils/AppError.js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILES = 6;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB each

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE, files: MAX_FILES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new AppError("Only JPG, PNG or WEBP images are allowed", 400));
    }
    cb(null, true);
  },
}).array("images", MAX_FILES);

// Wraps multer so its errors come out in our normal error format
export function uploadImages(req, res, next) {
  upload(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      let message = "Upload failed";
      if (err.code === "LIMIT_FILE_SIZE") {
        message = "Each image must be 5MB or smaller";
      } else if (
        err.code === "LIMIT_FILE_COUNT" ||
        err.code === "LIMIT_UNEXPECTED_FILE"
      ) {
        message = `You can upload up to ${MAX_FILES} images at a time`;
      }
      return next(new AppError(message, 400));
    }

    next(err);
  });
}