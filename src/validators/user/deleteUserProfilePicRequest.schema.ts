import { z } from 'zod';

export const deleteProfilePicRequest = z.object({
  body: z.object({
    path: z.string(),
  }),
});
