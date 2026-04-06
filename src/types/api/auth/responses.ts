import z from 'zod';
import { loginResponseSchema } from '../../../features/auth/loginResponse.schema.ts';
import { refreshTokenResponseSchema } from '../../../features/auth/refreshTokenResponse.schema.ts';
import { messageResponseSchema } from '../../../features/auth/messageResponse.schema.ts';
import { resetPasswordResponseSchema } from '../../../features/auth/resetPasswordResponse.schema.ts';

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;
