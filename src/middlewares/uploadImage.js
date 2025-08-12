import createError from "http-errors";
import multer from "multer";

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
      file.mimetype
    );
    cb(ok ? null : new createError(400, "Unsupported file type"), ok);
  },
});
