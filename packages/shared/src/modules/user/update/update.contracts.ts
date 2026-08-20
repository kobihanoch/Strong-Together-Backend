import {
  deleteProfilePicRequest,
  getAuthenticatedUserByIdResponseSchema,
  setProfilePicAndUpdateDBResponseSchema,
  updateAuthenticatedUserResponseSchema,
  updateUserRequest,
  userDataResponseSchema,
} from './update.schemas';
import z from 'zod/v4';

export type UpdateUserBody = z.infer<typeof updateUserRequest.shape.body>;
export type UpdateAuthenticatedUserResponse = z.infer<typeof updateAuthenticatedUserResponseSchema>;

export type UserDataResponse = z.infer<typeof userDataResponseSchema>;

export type GetAuthenticatedUserByIdResponse = z.infer<typeof getAuthenticatedUserByIdResponseSchema>;

export type DeleteUserProfilePicBody = z.infer<typeof deleteProfilePicRequest.shape.body>;

export type SetProfilePicAndUpdateDBResponse = z.infer<typeof setProfilePicAndUpdateDBResponseSchema>;
