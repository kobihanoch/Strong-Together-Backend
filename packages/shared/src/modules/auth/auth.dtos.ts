import { z } from 'zod/v4';
import { serializedDateSchema } from '../../common';
import { userDbSchema } from '../../database';

/** Normalized user record returned by identifier-based authentication queries. */
export const userByIdentifierQueryDtoSchema = z.object({
  id: userDbSchema.shape.id,
  name: userDbSchema.shape.name,
  username: userDbSchema.shape.username,
  email: userDbSchema.shape.email.optional(),
  passwordHash: userDbSchema.shape.passwordHash,
  role: userDbSchema.shape.role,
  isVerified: userDbSchema.shape.isVerified,
  lastLogin: serializedDateSchema.nullable().optional(),
});

/** Raw database function payload before snake_case fields are normalized. */
export const userByIdentifierRawQueryDtoSchema = userByIdentifierQueryDtoSchema
  .omit({ isVerified: true, lastLogin: true, passwordHash: true })
  .extend({
    password_hash: userDbSchema.shape.passwordHash,
    is_verified: z.boolean(),
    last_login: serializedDateSchema.nullable(),
  });

/** SQL row wrapping an identifier lookup result under `userData`. */
export const userByIdentifierRowQueryDtoSchema = z.object({
  userData: userByIdentifierRawQueryDtoSchema.nullable(),
});

/** Raw username lookup payload before `is_verified` is normalized. */
export const userByUsernameRawQueryDtoSchema = userByIdentifierQueryDtoSchema
  .omit({ isVerified: true, passwordHash: true })
  .extend({ password_hash: userDbSchema.shape.passwordHash, is_verified: z.boolean() });

/** SQL row wrapping a username lookup result under `userData`. */
export const userByUsernameRowQueryDtoSchema = z.object({ userData: userByUsernameRawQueryDtoSchema.nullable() });

export type UserByIdentifierQueryDto = z.infer<typeof userByIdentifierQueryDtoSchema>;
export type UserByIdentifierRawQueryDto = z.infer<typeof userByIdentifierRawQueryDtoSchema>;
export type UserByIdentifierRowQueryDto = z.infer<typeof userByIdentifierRowQueryDtoSchema>;
export type UserByUsernameRawQueryDto = z.infer<typeof userByUsernameRawQueryDtoSchema>;
export type UserByUsernameRowQueryDto = z.infer<typeof userByUsernameRowQueryDtoSchema>;
