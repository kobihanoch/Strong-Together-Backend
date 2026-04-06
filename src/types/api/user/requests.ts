import z from 'zod';
import { createUserRequest } from '../../../features/user/createUserRequest.schema.ts';
import { saveUserPushTokenRequest } from '../../../features/user/saveUserPushTokenRequest.schema.ts';
import { updateUserRequest } from '../../../features/user/updateUserRequest.schema.ts';
import { deleteProfilePicRequest } from '../../../features/user/deleteUserProfilePicRequest.schema.ts';

export type CreateUserBody = z.infer<typeof createUserRequest.shape.body>;
export type UpdateUserBody = z.infer<typeof updateUserRequest.shape.body>;
export type SaveUserPushTokenBody = z.infer<typeof saveUserPushTokenRequest.shape.body>;
export type DeleteUserProfilePicBody = z.infer<typeof deleteProfilePicRequest.shape.body>;
