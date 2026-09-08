import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../../common';
import { userDbSchema } from '../../../database';

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
  user: userDbSchema.shape.id,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const loginContract = { request: loginRequestSchema, response: loginResponseSchema } satisfies Contract;

// Refresh session

export const refreshTokenResponseSchema = z.object({
  message: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  userId: userDbSchema.shape.id,
});
export const refreshTokenContract = { response: refreshTokenResponseSchema } satisfies Contract;

// Log out

export const logoutResponseSchema = z.object({ message: z.string() });
export const logoutContract = { response: logoutResponseSchema } satisfies Contract;

export type LoginRequestBody = BodyOf<typeof loginContract>;
export type LoginResponse = ResponseOf<typeof loginContract>;
export type RefreshTokenResponse = ResponseOf<typeof refreshTokenContract>;
export type LogoutResponse = ResponseOf<typeof logoutContract>;
