import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../../common';

const userIdSchema = z.string().uuid();

// Log in

export const loginRequestSchema = z.object({
  body: z.object({
    identifier: z
      .string()
      .min(3)
      .refine((value) => z.string().email().safeParse(value).success || /^[a-zA-Z0-9_]{3,20}$/.test(value), {
        message: 'Must be a valid email or username',
      }),
    password: z.string().min(1, 'Username and password are required'),
  }),
});
export const loginResponseSchema = z.object({
  message: z.string(),
  user: userIdSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const loginContract = { request: loginRequestSchema, response: loginResponseSchema } satisfies Contract;

// Refresh session

export const refreshTokenResponseSchema = z.object({
  message: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  userId: userIdSchema,
});
export const refreshTokenContract = { response: refreshTokenResponseSchema } satisfies Contract;

// Log out

export const logoutResponseSchema = z.object({ message: z.string() });
export const logoutContract = { response: logoutResponseSchema } satisfies Contract;

/** Represents the login request body value. */
export type LoginRequestBody = BodyOf<typeof loginContract>;
/** Represents the login response value. */
export type LoginResponse = ResponseOf<typeof loginContract>;
/** Represents the refresh token response value. */
export type RefreshTokenResponse = ResponseOf<typeof refreshTokenContract>;
/** Represents the logout response value. */
export type LogoutResponse = ResponseOf<typeof logoutContract>;
