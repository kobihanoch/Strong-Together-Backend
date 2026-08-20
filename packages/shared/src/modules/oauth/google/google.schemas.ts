import { z } from 'zod/v4';

export const googleOAuthRequest = z.object({
  body: z.object({
    idToken: z.string().optional(),
  }),
});
