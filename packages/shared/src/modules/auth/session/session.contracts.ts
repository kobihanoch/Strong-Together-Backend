import z from 'zod/v4';
import { loginRequest, loginResponseSchema, logoutResponseSchema, refreshTokenResponseSchema } from './session.schemas';

export type LoginRequestBody = z.infer<typeof loginRequest.shape.body>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type LogOutResponse = z.infer<typeof logoutResponseSchema>;
