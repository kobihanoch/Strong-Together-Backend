import { BadRequestException } from '@nestjs/common';
import multer from 'multer';
import type { Request } from 'express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';

export const imageUploadOptions: MulterOptions = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    const ok = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.mimetype);

    if (!ok) {
      return cb(new BadRequestException('Unsupported file type'), false);
    }

    return cb(null, true);
  },
};
