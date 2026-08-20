import { z } from 'zod/v4';
import { serializedDateSchema } from '../../../common';
import { userDbSchema } from '../../../database';

export const updateUserRequest = z.object({
  body: z
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
    .partial(),
});

export const deleteProfilePicRequest = z.object({
  body: z.object({
    path: z.string(),
  }),
});

export const userDataSchema = z.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  email: userDbSchema.shape.email,
  name: userDbSchema.shape.name,
  gender: userDbSchema.shape.gender,
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  profileImageUrl: userDbSchema.shape.profilePicPath,
  pushToken: userDbSchema.shape.pushToken,
  role: userDbSchema.shape.role,
  isFirstLogin: z.boolean(),
  tokenVersion: userDbSchema.shape.tokenVersion,
  isVerified: userDbSchema.shape.isVerified,
  authProvider: userDbSchema.shape.authProvider,
  lastLogin: serializedDateSchema.nullable(),
});

export const userDataResponseSchema = z.object({
  userData: userDataSchema,
});

export const getAuthenticatedUserByIdResponseSchema = userDataSchema;

export const updateAuthenticatedUserResponseSchema = z.object({
  message: z.string(),
  emailChanged: z.boolean(),
  user: userDataSchema,
});

export const setProfilePicAndUpdateDBResponseSchema = z.object({
  path: z.string(),
  url: z.string(),
  message: z.string(),
});
