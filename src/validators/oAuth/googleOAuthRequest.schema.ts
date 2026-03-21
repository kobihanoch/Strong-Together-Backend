import { z } from 'zod';

export const googleOAuthRequest = z.object({
  body: z.object({
    idToken: z.string().optional(),
  }),
});
