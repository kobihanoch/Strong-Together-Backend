import { z } from 'zod';

const appleNameInput = z.object({
  givenName: z.string().optional(),
  familyName: z.string().optional(),
});

export const appleOAuthRequest = z.object({
  body: z.object({
    idToken: z.string().optional(),
    rawNonce: z.string().optional(),
    name: appleNameInput.optional().nullable(),
    email: z.string().email(),
  }),
});
