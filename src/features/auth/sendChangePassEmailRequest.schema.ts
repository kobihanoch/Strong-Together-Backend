import z from 'zod';

export const sendChangePassEmailRequest = z.object({
  body: z.object({ identifier: z.string() }),
});
