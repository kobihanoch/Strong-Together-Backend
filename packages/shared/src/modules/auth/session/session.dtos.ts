import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';
import { userDataQueryDtoSchema } from '../../user/update/update.dtos';

/** Claims carried by an issued access token. */
export const accessTokenPayloadDtoSchema = z.object({
  id: userDbSchema.shape.id,
  role: userDbSchema.shape.role,
  tokenVer: userDbSchema.shape.tokenVersion,
  cnf: z.object({ jkt: z.string() }).optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

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
export type UserAfterBumpQueryDto = z.infer<typeof userAfterBumpQueryDtoSchema>;
export type TokenVersionQueryDto = z.infer<typeof tokenVersionQueryDtoSchema>;
export type LastLoginQueryDto = z.infer<typeof lastLoginQueryDtoSchema>;
