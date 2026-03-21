import z from 'zod';

export const changeEmailAndVerifyRequest = z.object({
  body: z.object({ username: z.string(), password: z.string(), newEmail: z.string().trim().email('Invalid email') }),
});
