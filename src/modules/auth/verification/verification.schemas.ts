import z from 'zod';

export const verifyAccountRequest = z.object({
  query: z.object({
    token: z.string().optional(),
  }),
});

export const sendVerificationMailRequest = z.object({
  body: z.object({ email: z.string().trim().email('Invalid email') }),
});

export const changeEmailAndVerifyRequest = z.object({
  body: z.object({ username: z.string(), password: z.string(), newEmail: z.string().trim().email('Invalid email') }),
});

export const checkUserVerifyRequest = z.object({
  query: z.object({ username: z.string() }),
});
