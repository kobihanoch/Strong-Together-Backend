import crypto from 'crypto';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../config/auth.config.ts';
import type { AccessTokenPayload } from '@strong-together/shared';

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

export const decodeAccessToken = (accessToken: string | null): AccessTokenPayload | null => {
  if (!accessToken) return null;
  try {
    return jwt.verify(accessToken, authConfig.jwtAccessSecret) as AccessTokenPayload;
  } catch (e) {
    return null;
  }
};

export const generateJti = (): string => {
  return crypto.randomBytes(16).toString('hex');
};
