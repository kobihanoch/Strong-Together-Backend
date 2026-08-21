import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../../common';
import { authenticatedUserForUpdateQueryDtoSchema, userDataQueryDtoSchema } from './update.dtos';

// Update authenticated user

export const updateUserRequestSchema = z.object({
  body: authenticatedUserForUpdateQueryDtoSchema,
});
export const updateAuthenticatedUserResponseSchema = z.object({
  message: z.string(),
  emailChanged: z.boolean(),
  user: userDataQueryDtoSchema,
});

export const updateAuthenticatedUserContract = {
  request: updateUserRequestSchema,
  response: updateAuthenticatedUserResponseSchema,
} satisfies Contract;

// Wrap user data

export const userDataResponseSchema = z.object({ userData: userDataQueryDtoSchema });
export const userDataContract = { response: userDataResponseSchema } satisfies Contract;

// Get authenticated user by ID

export const getAuthenticatedUserByIdResponseSchema = userDataQueryDtoSchema;
export const getAuthenticatedUserByIdContract = {
  response: getAuthenticatedUserByIdResponseSchema,
} satisfies Contract;

// Delete profile picture

export const deleteProfilePicRequestSchema = z.object({ body: z.object({ profilePicPath: z.string() }) });
export const deleteUserProfilePicContract = { request: deleteProfilePicRequestSchema } satisfies Contract;

// Set profile picture

export const setProfilePicAndUpdateDBResponseSchema = z.object({
  profilePicPath: z.string(),
  url: z.string(),
  message: z.string(),
});
export const setProfilePicAndUpdateDBContract = {
  response: setProfilePicAndUpdateDBResponseSchema,
} satisfies Contract;

export type UpdateUserBody = BodyOf<typeof updateAuthenticatedUserContract>;
export type UpdateAuthenticatedUserResponse = ResponseOf<typeof updateAuthenticatedUserContract>;
export type UserDataResponse = ResponseOf<typeof userDataContract>;
export type GetAuthenticatedUserByIdResponse = ResponseOf<typeof getAuthenticatedUserByIdContract>;
export type DeleteUserProfilePicBody = BodyOf<typeof deleteUserProfilePicContract>;
export type SetProfilePicAndUpdateDBResponse = ResponseOf<typeof setProfilePicAndUpdateDBContract>;
