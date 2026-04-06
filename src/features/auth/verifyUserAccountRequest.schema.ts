import z from 'zod';

export const verifyAccountRequest = z.object({
  query: z.object({
    token: z.string().optional(),
  }),
});
