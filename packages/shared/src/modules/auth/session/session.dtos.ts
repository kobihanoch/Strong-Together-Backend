import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';
import { userDataQueryDtoSchema } from '../../user/update/update.dtos';

const legacyTokenSchema = z
  .object({
    id: userDbSchema.shape.id,
    role: userDbSchema.shape.role,
    cnf: z.object({ jkt: z.string() }).optional(),
    iat: z.number(),
    exp: z.number(),
  })
  .strict();

const currentAccessTokenSchema = z.object({
  id: userDbSchema.shape.id,
  sub: userDbSchema.shape.id,
  role: userDbSchema.shape.role,
  typ: z.literal('access'),
  iss: z.literal('strong-together'),
  aud: z.literal('strong-together-api'),
  cnf: z.object({ jkt: z.string() }).optional(),
  iat: z.number(),
  exp: z.number(),
});

/** Accepts current access tokens and normalizes legacy access tokens. */
export const accessTokenPayloadDtoSchema = z.union([
  currentAccessTokenSchema.refine((token) => token.sub === token.id),
  legacyTokenSchema.transform((token) => ({
    ...token,
    sub: token.id,
    typ: 'access' as const,
    iss: 'strong-together' as const,
    aud: 'strong-together-api' as const,
  })),
]);

/** Claims carried by an issued refresh token. */
export const refreshTokenPayloadDtoSchema = z.union([
  currentAccessTokenSchema
    .extend({
      typ: z.literal('refresh'),
      aud: z.literal('strong-together-refresh'),
      tokenVer: userDbSchema.shape.tokenVersion,
    })
    .refine((token) => token.sub === token.id),
  legacyTokenSchema.extend({ tokenVer: userDbSchema.shape.tokenVersion }).transform((token) => ({
    ...token,
    sub: token.id,
    typ: 'refresh' as const,
    iss: 'strong-together' as const,
    aud: 'strong-together-refresh' as const,
  })),
]);

/** User data returned after atomically incrementing the token version. */
export const userAfterBumpQueryDtoSchema = z.object({
  tokenVersion: userDbSchema.shape.tokenVersion,
  userData: userDataQueryDtoSchema,
});

/** Current token-version row returned by authentication checks. */
export const tokenVersionQueryDtoSchema = z.object({
  tokenVersion: userDbSchema.shape.tokenVersion,
});

/** Last-login row returned by the session lookup function. */
export const lastLoginQueryDtoSchema = z.object({ lastLogin: z.date().nullable() });

export type AccessTokenPayloadDto = z.infer<typeof accessTokenPayloadDtoSchema>;
export type RefreshTokenPayloadDto = z.infer<typeof refreshTokenPayloadDtoSchema>;
export type UserAfterBumpQueryDto = z.infer<typeof userAfterBumpQueryDtoSchema>;
export type TokenVersionQueryDto = z.infer<typeof tokenVersionQueryDtoSchema>;
export type LastLoginQueryDto = z.infer<typeof lastLoginQueryDtoSchema>;
