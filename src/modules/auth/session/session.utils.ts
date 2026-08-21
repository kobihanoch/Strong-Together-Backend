import { Request } from 'express';
import type { AccessTokenPayloadDto } from '@strong-together/shared';
import { authConfig } from '../../../config/auth.config';
import jwt from 'jsonwebtoken';
import { extractBearerToken, extractDpopToken } from '../../../common/authentication/authentication.utils';

export const decodeRefreshToken = (refreshToken: string | null): AccessTokenPayloadDto | null => {
  if (!refreshToken) return null;
  try {
    return jwt.verify(refreshToken, authConfig.jwtRefreshSecret) as AccessTokenPayloadDto;
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
