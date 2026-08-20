import z from 'zod/v4';
import { userDbSchema } from '../../../database';

export const verifyAccountRequest = z.object({
  query: z.object({
    token: z.string().optional(),
  }),
});

export const sendVerificationMailRequest = z.object({
  body: z.object({ email: userDbSchema.shape.email.trim().email('Invalid email') }),
});

export const changeEmailAndVerifyRequest = z.object({
  body: z.object({
    username: userDbSchema.shape.username,
    password: z.string(),
    newEmail: userDbSchema.shape.email.trim().email('Invalid email'),
  }),
});

export const checkUserVerifyRequest = z.object({
  query: z.object({ username: userDbSchema.shape.username }),
});
