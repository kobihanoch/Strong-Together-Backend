import { z } from 'zod/v4';
import type { BodyOf, Contract } from '../../../common';

// Sign in with Apple

const appleNameInputSchema = z.object({ givenName: z.string().nullable(), familyName: z.string().nullable() });
export const appleOAuthRequestSchema = z.object({
  body: z.object({
    idToken: z.string({ error: 'Missing or invalid Apple identityToken' }),
    rawNonce: z.string(),
    name: appleNameInputSchema.optional(),
    email: z.email().nullable(),
  }),
});

export const appleOAuthContract = { request: appleOAuthRequestSchema } satisfies Contract;

/** Represents the apple oauth body value. */
export type AppleOAuthBody = BodyOf<typeof appleOAuthContract>;
