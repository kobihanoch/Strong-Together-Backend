import z from 'zod';
import { userDataResponseSchema } from '../../../features/user/userDataResponse.schema.ts';
import { createUserResponseSchema } from '../../../features/user/createUserResponse.schema.ts';
import { getAuthenticatedUserByIdResponseSchema } from '../../../features/user/getAuthenticatedUserByIdResponse.schema.ts';
import { updateAuthenticatedUserResponseSchema } from '../../../features/user/updateAuthenticatedUserResponse.schema.ts';
import { setProfilePicAndUpdateDBResponseSchema } from '../../../features/user/setProfilePicAndUpdateDBResponse.schema.ts';

export type UserDataResponse = z.infer<typeof userDataResponseSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
export type GetAuthenticatedUserByIdResponse = z.infer<typeof getAuthenticatedUserByIdResponseSchema>;
export type UpdateAuthenticatedUserResponse = z.infer<typeof updateAuthenticatedUserResponseSchema>;
export type SetProfilePicAndUpdateDBResponse = z.infer<typeof setProfilePicAndUpdateDBResponseSchema>;
