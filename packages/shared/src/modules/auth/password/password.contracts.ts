import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf, ResponseOf } from '../../../common';

// Send password-change email

export const createPasswordResetRequestSchema = z.object({ body: z.object({ identifier: z.string() }) });

export const createPasswordResetRequestContract = { request: createPasswordResetRequestSchema } satisfies Contract;

// Reset password

export const resetPasswordRequestSchema = z.object({
  body: z.object({ newPassword: z.string().min(8, 'Password must be at least 8 characters long') }),
  query: z.object({ token: z.string().optional() }),
});
export const resetPasswordResponseSchema = z.void();
export const resetPasswordContract = {
  request: resetPasswordRequestSchema,
  response: resetPasswordResponseSchema,
} satisfies Contract;

export type CreatePasswordResetRequestBody = BodyOf<typeof createPasswordResetRequestContract>;
export type ResetPasswordBody = BodyOf<typeof resetPasswordContract>;
export type ResetPasswordQuery = QueryOf<typeof resetPasswordContract>;
export type ResetPasswordResponse = ResponseOf<typeof resetPasswordContract>;
