import { z } from 'zod';

export const deleteMessageRequest = z.object({
  params: z.object({
    id: z.string(), // MSG ID
  }),
});
