import z from 'zod';
import { createUserRequest } from '../../../validators/user/createUserRequest.schema.ts';
import { saveUserPushTokenRequest } from '../../../validators/user/saveUserPushTokenRequest.schema.ts';
import { updateUserRequest } from '../../../validators/user/updateUserRequest.schema.ts';
import { deleteProfilePicRequest } from '../../../validators/user/deleteUserProfilePicRequest.schema.ts';

export type CreateUserBody = z.infer<typeof createUserRequest.shape.body>;
export type UpdateUserBody = z.infer<typeof updateUserRequest.shape.body>;
export type SaveUserPushTokenBody = z.infer<typeof saveUserPushTokenRequest.shape.body>;
export type DeleteUserProfilePicBody = z.infer<typeof deleteProfilePicRequest.shape.body>;
