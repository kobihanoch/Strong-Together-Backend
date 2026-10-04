import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { z } from 'zod/v4';
import { signTokens } from '../../../../common/authentication/authentication.utils';
import { authConfig } from '../../../../config/auth.config';
import type { IssuedTokens, OneTimeAuthTokenPayload, RefreshTokenPayload } from '../application/models/auth.models';
import { AuthTokens } from '../application/ports/auth-tokens.port';

const legacyRefreshTokenSchema = z
  .object({
    id: z.string().uuid(),
    role: z.string(),
    tokenVer: z.number(),
    cnf: z.object({ jkt: z.string() }).optional(),
    iat: z.number(),
    exp: z.number(),
  })
  .strict();

const currentRefreshTokenSchema = z
  .object({
    id: z.string().uuid(),
    sub: z.string().uuid(),
    role: z.string(),
    tokenVer: z.number(),
    typ: z.literal('refresh'),
    iss: z.literal('strong-together'),
    aud: z.literal('strong-together-refresh'),
    cnf: z.object({ jkt: z.string() }).optional(),
    iat: z.number(),
    exp: z.number(),
  })
  .refine((token) => token.sub === token.id);

const refreshTokenSchema = z.union([
  currentRefreshTokenSchema,
  legacyRefreshTokenSchema.transform((token) => ({
    ...token,
    sub: token.id,
    typ: 'refresh' as const,
    iss: 'strong-together' as const,
    aud: 'strong-together-refresh' as const,
  })),
]);

/** Shared JWT implementation of authentication token operations. */
@Injectable()
export class JwtAuthTokens implements AuthTokens {
  issueSession(userId: string, role: string, tokenVersion: number, jkt?: string): IssuedTokens {
    return signTokens(userId, role, tokenVersion, '5m', '14d', jkt);
  }

  decodeRefresh(token: string, ignoreExpiration: boolean = false): RefreshTokenPayload | null {
    try {
      const decoded = jwt.verify(token, authConfig.jwtRefreshSecret, { algorithms: ['HS256'], ignoreExpiration });
      const parsed = refreshTokenSchema.safeParse(decoded);
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }

  decodeVerification(token: string): OneTimeAuthTokenPayload | null {
    return this.verifyOneTimeToken(token, authConfig.jwtVerifySecret);
  }

  decodePasswordReset(token: string): OneTimeAuthTokenPayload | null {
    return this.verifyOneTimeToken(token, authConfig.jwtForgotPasswordSecret);
  }

  private verifyOneTimeToken(token: string, secret: string): OneTimeAuthTokenPayload | null {
    try {
      return jwt.verify(token, secret) as OneTimeAuthTokenPayload;
    } catch {
      return null;
    }
  }
}
