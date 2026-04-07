import z from 'zod';
import { createUserResponseSchema } from '../../../../modules/user/create/create.schemas.ts';
import {
  userDataResponseSchema,
  getAuthenticatedUserByIdResponseSchema,
  updateAuthenticatedUserResponseSchema,
  setProfilePicAndUpdateDBResponseSchema,
} from '../../../../modules/user/update/update.schemas.ts';

export type UserDataResponse = z.infer<typeof userDataResponseSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
export type GetAuthenticatedUserByIdResponse = z.infer<typeof getAuthenticatedUserByIdResponseSchema>;
export type UpdateAuthenticatedUserResponse = z.infer<typeof updateAuthenticatedUserResponseSchema>;
export type SetProfilePicAndUpdateDBResponse = z.infer<typeof setProfilePicAndUpdateDBResponseSchema>;
