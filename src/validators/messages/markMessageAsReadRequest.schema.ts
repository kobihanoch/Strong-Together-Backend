import { z } from 'zod';

export const markMessageAsReadRequest = z.object({
  params: z.object({
    id: z.string(), // MSG ID
  }),
});
