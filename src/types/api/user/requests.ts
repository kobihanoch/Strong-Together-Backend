import z from 'zod';
import { createUserRequest } from '../../../modules/user/create/user.create.schemas.ts';
import { saveUserPushTokenRequest } from '../../../modules/user/push-tokens/user.push-tokens.schemas.ts';
import { updateUserRequest, deleteProfilePicRequest } from '../../../modules/user/update/user.update.schemas.ts';

export type CreateUserBody = z.infer<typeof createUserRequest.shape.body>;
export type UpdateUserBody = z.infer<typeof updateUserRequest.shape.body>;
export type SaveUserPushTokenBody = z.infer<typeof saveUserPushTokenRequest.shape.body>;
export type DeleteUserProfilePicBody = z.infer<typeof deleteProfilePicRequest.shape.body>;
