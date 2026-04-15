import { BadRequestException } from '@nestjs/common';
import multer, { type FileFilterCallback } from 'multer';
import type { Request } from 'express';

export const imageUploadOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ok = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype);

    if (!ok) {
      return cb(new BadRequestException('Unsupported file type'));
    }

    return cb(null, true);
  },
};
