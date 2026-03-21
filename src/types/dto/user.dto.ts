import z from 'zod';
import { updateUserSchema } from '../../validators/update/updateUser.schema.js';

export interface ChangeEmailTokenPayload {
  jti: string;
  sub: string;
  newEmail: string;
  exp: number;
  iss: string;
  typ: string;
}

export type AuthenticatedUserForUpdate = z.infer<typeof updateUserSchema>;
