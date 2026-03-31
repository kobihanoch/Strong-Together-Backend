import { z } from 'zod';

export const getAllMessagesRequest = z.object({
  query: z.object({
    tz: z.string(),
  }),
});
