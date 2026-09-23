import { z } from 'zod/v4';
import { serializedDateSchema, type BodyOf, type Contract, type ResponseOf } from '../../../common';

const authenticatedUserForUpdateSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be at most 15 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username may contain letters, numbers, and underscore only')
    .optional(),
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(20, 'Full name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Full name may contain letters and spaces only')
    .optional(),
  email: z.string().trim().toLowerCase().email('Invalid email format').optional(),
});

const userDataSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  gender: z.string(),
  createdAt: serializedDateSchema,
  updatedAt: serializedDateSchema,
  profilePicPath: z.string().nullable(),
  pushToken: z.string().nullable(),
  role: z.string(),
  isFirstLogin: z.boolean(),
  tokenVersion: z.number(),
  isVerified: z.boolean(),
  authProvider: z.string(),
  lastLogin: serializedDateSchema.nullable(),
});

// Update authenticated user

export const updateCurrentUserRequestSchema = z.object({
  body: authenticatedUserForUpdateSchema,
});
export const updateCurrentUserResponseSchema = z.void();

export const updateCurrentUserContract = {
  request: updateCurrentUserRequestSchema,
  response: updateCurrentUserResponseSchema,
} satisfies Contract;

// Wrap user data

export const userDataResponseSchema = z.object({ userData: userDataSchema });
export const userDataContract = { response: userDataResponseSchema } satisfies Contract;

// Get authenticated user by ID

export const getCurrentUserResponseSchema = userDataSchema;
export const getCurrentUserContract = {
  response: getCurrentUserResponseSchema,
} satisfies Contract;

// Delete profile picture

export const deleteProfilePictureRequestSchema = z.object({ body: z.object({ profilePicPath: z.string() }) });
export const deleteProfilePictureContract = { request: deleteProfilePictureRequestSchema } satisfies Contract;

// Set profile picture

export const replaceProfilePictureResponseSchema = z.object({
  profilePicPath: z.string(),
  url: z.string(),
  message: z.string(),
});
export const replaceProfilePictureContract = {
  response: replaceProfilePictureResponseSchema,
} satisfies Contract;

/** Represents the update current user body value. */
export type UpdateCurrentUserBody = BodyOf<typeof updateCurrentUserContract>;
/** Represents the update current user response value. */
export type UpdateCurrentUserResponse = ResponseOf<typeof updateCurrentUserContract>;
/** Represents the user data response value. */
export type UserDataResponse = ResponseOf<typeof userDataContract>;
/** Represents the get current user response value. */
export type GetCurrentUserResponse = ResponseOf<typeof getCurrentUserContract>;
/** Represents the delete profile picture body value. */
export type DeleteProfilePictureBody = BodyOf<typeof deleteProfilePictureContract>;
/** Represents the replace profile picture response value. */
export type ReplaceProfilePictureResponse = ResponseOf<typeof replaceProfilePictureContract>;
