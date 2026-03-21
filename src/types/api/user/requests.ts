import z from 'zod';
import { registerSchema } from '../../../validators/auth/register.schema.js';
import { updateUserSchema } from '../../../validators/update/updateUser.schema.js';

export type CreateUserRequest = z.infer<typeof registerSchema>;

export type UpdateUserBody = z.infer<typeof updateUserSchema>;

export interface SaveUserPushTokenRequest {
  token: string;
}

export interface DeleteUserProfilePicRequest {
  path: string;
}
