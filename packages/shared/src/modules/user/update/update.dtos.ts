import { z } from 'zod/v4';
import { updateUserRequest } from './update.schemas';

export const changeEmailTokenPayloadSchema = z.object({
  jti: z.string(),
  sub: z.string(),
  newEmail: z.string(),
  exp: z.number(),
  iss: z.string(),
  typ: z.string(),
});

export type ChangeEmailTokenPayload = z.infer<typeof changeEmailTokenPayloadSchema>;
export type AuthenticatedUserForUpdate = z.infer<typeof updateUserRequest.shape.body>;
