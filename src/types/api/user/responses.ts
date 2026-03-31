import z from 'zod';
import { userDataResponseSchema } from '../../../validators/user/userDataResponse.schema.ts';
import { createUserResponseSchema } from '../../../validators/user/createUserResponse.schema.ts';
import { getAuthenticatedUserByIdResponseSchema } from '../../../validators/user/getAuthenticatedUserByIdResponse.schema.ts';
import { updateAuthenticatedUserResponseSchema } from '../../../validators/user/updateAuthenticatedUserResponse.schema.ts';
import { setProfilePicAndUpdateDBResponseSchema } from '../../../validators/user/setProfilePicAndUpdateDBResponse.schema.ts';

export type UserDataResponse = z.infer<typeof userDataResponseSchema>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;
export type GetAuthenticatedUserByIdResponse = z.infer<typeof getAuthenticatedUserByIdResponseSchema>;
export type UpdateAuthenticatedUserResponse = z.infer<typeof updateAuthenticatedUserResponseSchema>;
export type SetProfilePicAndUpdateDBResponse = z.infer<typeof setProfilePicAndUpdateDBResponseSchema>;
