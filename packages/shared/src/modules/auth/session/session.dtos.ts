import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';
import { userDataSchema } from '../../user/update/update.schemas';

export const accessTokenPayloadSchema = z.object({
  id: userDbSchema.shape.id,
  role: userDbSchema.shape.role,
  tokenVer: userDbSchema.shape.tokenVersion,
  cnf: z.object({ jkt: z.string() }).optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export const userAfterBumpSchema = z.object({
  tokenVersion: userDbSchema.shape.tokenVersion,
  userData: userDataSchema,
});

export const tokenVersionResultSchema = z.object({
  tokenVersion: userDbSchema.shape.tokenVersion,
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;
export type UserAfterBump = z.infer<typeof userAfterBumpSchema>;
export type TokenVersionResult = z.infer<typeof tokenVersionResultSchema>;
