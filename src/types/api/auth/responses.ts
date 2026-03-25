import z from 'zod';
import { loginResponseSchema } from '../../../validators/auth/loginResponse.schema.ts';
import { refreshTokenResponseSchema } from '../../../validators/auth/refreshTokenResponse.schema.ts';
import { messageResponseSchema } from '../../../validators/auth/messageResponse.schema.ts';
import { resetPasswordResponseSchema } from '../../../validators/auth/resetPasswordResponse.schema.ts';

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type MessageResponse = z.infer<typeof messageResponseSchema>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;
