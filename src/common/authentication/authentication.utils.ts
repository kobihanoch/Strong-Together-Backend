import crypto from 'crypto';
import { Request } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { authConfig } from '../../config/auth.config';
import { accessTokenPayloadDtoSchema, type AccessTokenPayloadDto, type UserRow } from '@strong-together/shared';

/*
 * Extracts a Bearer token from a header string safely.
 */
export const extractBearerToken = (rawHeader: string | undefined): string | null => {
  if (!rawHeader || typeof rawHeader !== 'string') return null;
  return rawHeader.startsWith('Bearer ') ? rawHeader.slice(7).trim() : rawHeader.trim() || null;
};

export const extractDpopToken = (rawHeader: string | undefined): string | null => {
  if (!rawHeader || typeof rawHeader !== 'string') return null;
  if (!rawHeader.startsWith('DPoP ')) return null;
  return rawHeader.slice(5).trim() || null;
};

/*
 * Extracts the access token from the Authorization header.
 */
export const getAccessToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  return extractDpopToken(authHeader) || extractBearerToken(authHeader);
};

export const decodeAccessToken = (accessToken: string | null): AccessTokenPayloadDto | null => {
  if (!accessToken) return null;
  try {
    const decoded = jwt.verify(accessToken, authConfig.jwtAccessSecret, { algorithms: ['HS256'] });
    const parsed = accessTokenPayloadDtoSchema.safeParse(decoded);
    return parsed.success ? parsed.data : null;
  } catch (e) {
    return null;
  }
};

export const generateJti = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

export const signTokens = (
  id: UserRow['id'],
  role: UserRow['role'],
  tokenVer: UserRow['tokenVersion'],
  accessExp: NonNullable<SignOptions['expiresIn']>,
  refreshExp: NonNullable<SignOptions['expiresIn']>,
  jkt?: string,
) => {
  const cnfClaim = jkt
    ? {
        cnf: {
          jkt: jkt.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''),
        },
      }
    : {};

  const accessClaims = {
    id,
    role,
    typ: 'access',
    ...cnfClaim,
  };

  const refreshClaims = {
    id,
    role,
    typ: 'refresh',
    tokenVer: Number(tokenVer),
    ...cnfClaim,
  };

  return {
    accessToken: jwt.sign(accessClaims, authConfig.jwtAccessSecret, {
      algorithm: 'HS256',
      issuer: authConfig.jwtIssuer,
      audience: authConfig.jwtAccessAudience,
      subject: id,
      expiresIn: accessExp,
    }),
    refreshToken: jwt.sign(refreshClaims, authConfig.jwtRefreshSecret, {
      algorithm: 'HS256',
      issuer: authConfig.jwtIssuer,
      audience: authConfig.jwtRefreshAudience,
      subject: id,
      expiresIn: refreshExp,
    }),
  };
};
