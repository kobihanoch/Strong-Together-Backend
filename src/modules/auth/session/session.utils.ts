import { Request } from 'express';
import type { RefreshTokenPayloadDto } from '@strong-together/shared';
import { authConfig } from '../../../config/auth.config';
import jwt from 'jsonwebtoken';
import { extractBearerToken, extractDpopToken } from '../../../common/authentication/authentication.utils';

export const decodeRefreshToken = (refreshToken: string | null): RefreshTokenPayloadDto | null => {
  if (!refreshToken) return null;
  try {
    return jwt.verify(refreshToken, authConfig.jwtRefreshSecret) as RefreshTokenPayloadDto;
  } catch {
    return null;
  }
};

export const decodeRefreshTokenForLogout = (refreshToken: string | null): RefreshTokenPayloadDto | null => {
  if (!refreshToken) return null;
  try {
    return jwt.verify(refreshToken, authConfig.jwtRefreshSecret, { ignoreExpiration: true }) as RefreshTokenPayloadDto;
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
