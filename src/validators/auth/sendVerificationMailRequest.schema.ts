import z from 'zod';

export const sendVerificationMailRequest = z.object({
  body: z.object({ email: z.string().trim().email('Invalid email') }),
});
