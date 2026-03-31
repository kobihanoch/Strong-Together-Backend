import { z } from 'zod';

export const setProfilePicAndUpdateDBResponseSchema = z.object({
  path: z.string(),
  url: z.string(),
  message: z.string(),
});
