import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';

export const loginRequest = z.object({
  body: z.object({
    identifier: z
      .string()
      .min(3)
      .refine(
        (val) => {
          const isEmail = z.string().email().safeParse(val).success;
          const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(val);
          return isEmail || isUsername;
        },
        {
          message: 'Must be a valid email or username',
        },
      ),
    password: z.string().min(1, 'Username and password are required'),
  }),
});

export const loginResponseSchema = z.object({
  message: z.string(),
  user: userDbSchema.shape.id,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const logoutResponseSchema = z.object({
  message: z.string(),
});

export const refreshTokenResponseSchema = z.object({
  message: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  userId: userDbSchema.shape.id,
});
