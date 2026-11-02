import { getCloudinary } from "../config/cloudinary.js";
import AppError from "../utils/AppError.js";

function uploadBuffer(cloudinary, buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ember/products",
        resource_type: "image",
        // Cap the size and let Cloudinary pick a sensible quality
        transformation: [
          { width: 1600, height: 2000, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

// POST /api/admin/uploads (admin only) -> { success, images: [url, ...] }
export const uploadProductImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new AppError("Choose at least one image", 400);
  }

  const cloudinary = getCloudinary();

  let results;
  try {
    results = await Promise.all(
      req.files.map((file) => uploadBuffer(cloudinary, file.buffer))
    );
  } catch (err) {
    throw new AppError(`Image upload failed: ${err.message}`, 502);
  }

  res.status(201).json({
    success: true,
    images: results.map((r) => r.secure_url),
  });
};