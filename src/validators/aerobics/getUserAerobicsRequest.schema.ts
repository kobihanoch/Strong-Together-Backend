import z from 'zod';

export const getAerobicsRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});
