import crypto from 'crypto';
import { Request } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { authConfig } from '../../config/auth.config';
import type { AccessTokenPayloadDto, UserRow } from '@strong-together/shared';

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
    return jwt.verify(accessToken, authConfig.jwtAccessSecret) as AccessTokenPayloadDto;
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

  const userClaims = {
    id,
    role,
    ...cnfClaim,
  };

  return {
    accessToken: jwt.sign(userClaims, authConfig.jwtAccessSecret, { expiresIn: accessExp }),
    refreshToken: jwt.sign({ ...userClaims, tokenVer }, authConfig.jwtRefreshSecret, { expiresIn: refreshExp }),
  };
};
