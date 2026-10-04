import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf, ResponseOf } from '../../../common';

// Send password-change email

export const createPasswordResetRequestSchema = z.object({ body: z.object({ identifier: z.string().trim().min(1).max(254) }) });

export const createPasswordResetRequestContract = { request: createPasswordResetRequestSchema } satisfies Contract;

// Reset password

export const resetPasswordRequestSchema = z.object({
  body: z.object({ newPassword: z.string().min(8, 'Password must be at least 8 characters long').max(128, 'Password must be at most 128 characters long') }),
  query: z.object({ token: z.string().min(1).max(16_384).optional() }),
});
export const resetPasswordResponseSchema = z.void();
export const resetPasswordContract = {
  request: resetPasswordRequestSchema,
  response: resetPasswordResponseSchema,
} satisfies Contract;

/** Represents the create password reset request body value. */
export type CreatePasswordResetRequestBody = BodyOf<typeof createPasswordResetRequestContract>;
/** Represents the reset password body value. */
export type ResetPasswordBody = BodyOf<typeof resetPasswordContract>;
/** Represents the reset password query value. */
export type ResetPasswordQuery = QueryOf<typeof resetPasswordContract>;
/** Represents the reset password response value. */
export type ResetPasswordResponse = ResponseOf<typeof resetPasswordContract>;
