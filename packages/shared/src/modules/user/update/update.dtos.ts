import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
import { userDbSchema } from '../../../database';

/** Fields consumed by the authenticated-user update query. */
export const authenticatedUserForUpdateQueryDtoSchema = z
  .object({
    username: userDbSchema.shape.username
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(15, 'Username must be at most 15 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username may contain letters, numbers, and underscore only'),
    fullName: userDbSchema.shape.name
      .trim()
      .min(1, 'Full name is required')
      .max(20, 'Full name is too long')
      .regex(/^[a-zA-Z\s]+$/, 'Full name may contain letters and spaces only'),
    email: userDbSchema.shape.email.trim().toLowerCase().email('Invalid email format'),
  })
  .partial();

/** User JSON object produced by authenticated-user SQL queries. */
export const userDataQueryDtoSchema = z.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  email: userDbSchema.shape.email,
  name: userDbSchema.shape.name,
  gender: userDbSchema.shape.gender,
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  profilePicPath: userDbSchema.shape.profilePicPath,
  pushToken: userDbSchema.shape.pushToken,
  role: userDbSchema.shape.role,
  isFirstLogin: z.boolean(),
  tokenVersion: userDbSchema.shape.tokenVersion,
  isVerified: userDbSchema.shape.isVerified,
  authProvider: userDbSchema.shape.authProvider,
  lastLogin: serializedDateSchema.nullable(),
});

/** SQL row wrapping authenticated-user JSON under `userData`. */
export const userDataRowQueryDtoSchema = z.object({ userData: userDataQueryDtoSchema });

/** SQL row returned by the username/email conflict check. */
export const userConflictQueryDtoSchema = z.object({ conflict: z.boolean() });

/** Compact user row used when sending user-related messages. */
export const userMessageIdentityQueryDtoSchema = z.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  name: userDbSchema.shape.name,
  profilePicPath: userDbSchema.shape.profilePicPath,
});

/** Profile-picture path returned by profile picture queries. */
export const userProfilePicQueryDtoSchema = z.object({ profilePicPath: userDbSchema.shape.profilePicPath });

/** Claims carried by an email-change token. */
export const changeEmailTokenPayloadDtoSchema = z.object({
  jti: z.string(),
  sub: z.string(),
  newEmail: z.string(),
  exp: z.number(),
  iss: z.string(),
  typ: z.string(),
});
export type ChangeEmailTokenPayloadDto = z.infer<typeof changeEmailTokenPayloadDtoSchema>;

/** Input fields accepted by the authenticated-user update SQL query. */
export type AuthenticatedUserForUpdateQueryDto = z.infer<typeof authenticatedUserForUpdateQueryDtoSchema>;
export type UserDataQueryDto = z.infer<typeof userDataQueryDtoSchema>;
export type UserDataRowQueryDto = z.infer<typeof userDataRowQueryDtoSchema>;
export type UserConflictQueryDto = z.infer<typeof userConflictQueryDtoSchema>;
export type UserMessageIdentityQueryDto = z.infer<typeof userMessageIdentityQueryDtoSchema>;
export type UserProfilePicQueryDto = z.infer<typeof userProfilePicQueryDtoSchema>;
