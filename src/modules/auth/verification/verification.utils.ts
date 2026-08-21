import jwt from 'jsonwebtoken';
import type { EmailVerifyPayloadDto } from '@strong-together/shared';
import { authConfig } from '../../../config/auth.config';

export const decodeVerifyToken = (verifyToken: string): EmailVerifyPayloadDto | null => {
  try {
    return jwt.verify(verifyToken, authConfig.jwtVerifySecret) as EmailVerifyPayloadDto;
  } catch {
    return null;
  }
};
