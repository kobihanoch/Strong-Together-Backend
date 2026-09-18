import { Request } from 'express';
import { refreshTokenPayloadDtoSchema, type RefreshTokenPayloadDto } from '@strong-together/shared';
import { authConfig } from '../../../config/auth.config';
import jwt from 'jsonwebtoken';
import { extractBearerToken, extractDpopToken } from '../../../common/authentication/authentication.utils';

export const decodeRefreshToken = (refreshToken: string | null): RefreshTokenPayloadDto | null => {
  return decodeRefreshTokenValue(refreshToken, false);
};

export const decodeRefreshTokenForLogout = (refreshToken: string | null): RefreshTokenPayloadDto | null => {
  return decodeRefreshTokenValue(refreshToken, true);
};

const decodeRefreshTokenValue = (refreshToken: string | null, ignoreExpiration: boolean): RefreshTokenPayloadDto | null => {
  if (!refreshToken) return null;
  try {
    const decoded = jwt.verify(refreshToken, authConfig.jwtRefreshSecret, {
      algorithms: ['HS256'],
      ignoreExpiration,
    });
    const parsed = refreshTokenPayloadDtoSchema.safeParse(decoded);
    return parsed.success ? parsed.data : null;
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
