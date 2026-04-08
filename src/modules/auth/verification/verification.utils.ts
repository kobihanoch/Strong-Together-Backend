import jwt from 'jsonwebtoken';
import { EmailVerifyPayload } from '../../../shared/types/dto/auth.dto.ts';
import { authConfig } from '../../../config/auth.config.ts';

export const decodeVerifyToken = (verifyToken: string): EmailVerifyPayload | null => {
  try {
    return jwt.verify(verifyToken, authConfig.jwtVerifySecret) as EmailVerifyPayload;
  } catch {
    return null;
  }
};
