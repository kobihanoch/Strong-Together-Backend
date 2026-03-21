import multer, { type FileFilterCallback } from 'multer';
import type { Request } from 'express';
import createError from 'http-errors';

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ok = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype);

    if (!ok) {
      return cb(createError(400, 'Unsupported file type'));
    }

    return cb(null, true);
  },
});
