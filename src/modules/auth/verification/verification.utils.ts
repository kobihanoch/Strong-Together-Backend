import jwt from 'jsonwebtoken';
import type { EmailVerifyPayload } from '@strong-together/shared';
import { authConfig } from '../../../config/auth.config.ts';

export const decodeVerifyToken = (verifyToken: string): EmailVerifyPayload | null => {
  try {
    return jwt.verify(verifyToken, authConfig.jwtVerifySecret) as EmailVerifyPayload;
  } catch {
    return null;
  }
};
