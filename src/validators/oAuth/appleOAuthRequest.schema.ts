import { z } from 'zod';

const appleNameInput = z.object({
  givenName: z.string().nullable(),
  familyName: z.string().nullable(),
});

export const appleOAuthRequest = z.object({
  body: z.object({
    idToken: z.string(),
    rawNonce: z.string(),
    name: appleNameInput.optional(),
    email: z.string().email().nullable(),
  }),
});
