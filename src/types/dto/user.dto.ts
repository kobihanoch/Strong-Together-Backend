import z from 'zod';
import { updateUserRequest } from '../../validators/user/updateUserRequest.schema.ts';

export interface ChangeEmailTokenPayload {
  jti: string;
  sub: string;
  newEmail: string;
  exp: number;
  iss: string;
  typ: string;
}

export type AuthenticatedUserForUpdate = z.infer<typeof updateUserRequest.shape.body>;
