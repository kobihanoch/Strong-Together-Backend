import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';

const appleNameInput = z.object({
  givenName: z.string().nullable(),
  familyName: z.string().nullable(),
});

export const appleOAuthRequest = z.object({
  body: z.object({
    idToken: z.string({ error: 'Missing or invalid Apple identityToken' }),
    rawNonce: z.string(),
    name: appleNameInput.optional(),
    email: userDbSchema.shape.email.email().nullable(),
  }),
});
