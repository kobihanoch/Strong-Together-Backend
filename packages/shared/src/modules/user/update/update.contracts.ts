import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../../common';
import { authenticatedUserForUpdateQueryDtoSchema, userDataQueryDtoSchema } from './update.dtos';

// Update authenticated user

export const updateCurrentUserRequestSchema = z.object({
  body: authenticatedUserForUpdateQueryDtoSchema,
});
export const updateCurrentUserResponseSchema = z.object({
  message: z.string(),
  emailChanged: z.boolean(),
  user: userDataQueryDtoSchema,
});

export const updateCurrentUserContract = {
  request: updateCurrentUserRequestSchema,
  response: updateCurrentUserResponseSchema,
} satisfies Contract;

// Wrap user data

export const userDataResponseSchema = z.object({ userData: userDataQueryDtoSchema });
export const userDataContract = { response: userDataResponseSchema } satisfies Contract;

// Get authenticated user by ID

export const getCurrentUserResponseSchema = userDataQueryDtoSchema;
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

export type UpdateCurrentUserBody = BodyOf<typeof updateCurrentUserContract>;
export type UpdateCurrentUserResponse = ResponseOf<typeof updateCurrentUserContract>;
export type UserDataResponse = ResponseOf<typeof userDataContract>;
export type GetCurrentUserResponse = ResponseOf<typeof getCurrentUserContract>;
export type DeleteProfilePictureBody = BodyOf<typeof deleteProfilePictureContract>;
export type ReplaceProfilePictureResponse = ResponseOf<typeof replaceProfilePictureContract>;
