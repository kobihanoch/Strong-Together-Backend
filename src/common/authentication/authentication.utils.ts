import crypto from 'crypto';
import { Request } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod/v4';
import { authConfig } from '../../config/auth.config';

const legacyAccessTokenSchema = z
  .object({
    id: z.string().uuid(),
    role: z.string(),
    cnf: z.object({ jkt: z.string() }).optional(),
    iat: z.number(),
    exp: z.number(),
  })
  .strict();

const currentAccessTokenSchema = z.object({
  id: z.string().uuid(),
  sub: z.string().uuid(),
  role: z.string(),
  typ: z.literal('access'),
  iss: z.literal('strong-together'),
  aud: z.literal('strong-together-api'),
  cnf: z.object({ jkt: z.string() }).optional(),
  iat: z.number(),
  exp: z.number(),
});

const accessTokenPayloadSchema = z.union([
  currentAccessTokenSchema.refine((token) => token.sub === token.id),
  legacyAccessTokenSchema.transform((token) => ({
    ...token,
    sub: token.id,
    typ: 'access' as const,
    iss: 'strong-together' as const,
    aud: 'strong-together-api' as const,
  })),
]);

type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;

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
    const decoded = jwt.verify(accessToken, authConfig.jwtAccessSecret, { algorithms: ['HS256'] });
    const parsed = accessTokenPayloadSchema.safeParse(decoded);
    return parsed.success ? parsed.data : null;
  } catch (e) {
    return null;
  }
};

export const generateJti = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

export const signTokens = (
  id: string,
  role: string,
  tokenVer: number,
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
