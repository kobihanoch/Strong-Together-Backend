import { z } from 'zod';

export const saveUserPushTokenRequest = z.object({
  body: z.object({
    token: z.string(),
  }),
});
