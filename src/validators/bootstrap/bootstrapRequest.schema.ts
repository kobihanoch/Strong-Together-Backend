import z from 'zod';

export const bootstrapRequest = z.object({
  query: z.object({
    tz: z.string().optional(),
  }),
});
