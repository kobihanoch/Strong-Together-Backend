import { Request } from 'express';
import type { AccessTokenPayload } from '@strong-together/shared';
import { authConfig } from '../../../config/auth.config.ts';
import jwt from 'jsonwebtoken';
import { extractBearerToken, extractDpopToken } from '../../../common/authentication/authentication.utils.ts';

export const decodeRefreshToken = (refreshToken: string | null): AccessTokenPayload | null => {
  if (!refreshToken) return null;
  try {
    return jwt.verify(refreshToken, authConfig.jwtRefreshSecret) as AccessTokenPayload;
  } catch {
    return null;
  }
};

/*
 * Extracts the refresh token from the x-refresh-token header.
 */
export const getRefreshToken = (req: Request): string | null => {
  const refreshHeader = req.headers['x-refresh-token'] as string | undefined;
  return extractDpopToken(refreshHeader) || extractBearerToken(refreshHeader);
};
