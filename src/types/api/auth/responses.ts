import z from 'zod';
import {
  loginResponseSchema,
  messageResponseSchema,
  refreshTokenResponseSchema,
} from '../../../modules/auth/session/auth.session.schemas.ts';
import { resetPasswordResponseSchema } from '../../../modules/auth/password/auth.password.schemas.ts';

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;
