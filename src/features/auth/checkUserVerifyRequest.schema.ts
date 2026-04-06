import z from 'zod';

export const checkUserVerifyRequest = z.object({
  query: z.object({ username: z.string() }),
});
