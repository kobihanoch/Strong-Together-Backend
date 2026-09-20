import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { appConfig } from '../../../../config/app.config';

export const validateJkt = (req: Request): string => {
  const jkt = req.headers['dpop-key-binding'] as string | undefined;
  if (appConfig.dpopEnabled) {
    if (!jkt) {
      throw new BadRequestException('DPoP-Key-Binding header is missing.');
    }
  }

  return jkt as string;
};
