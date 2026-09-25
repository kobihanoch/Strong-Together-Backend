import { z } from 'zod/v4';
import type { BodyOf, Contract } from '../../../common';

// Sign in with Apple

const appleNameInputSchema = z.object({
  givenName: z.string().trim().min(1).max(100).nullable(),
  familyName: z.string().trim().min(1).max(100).nullable(),
});
export const appleOAuthRequestSchema = z.object({
  body: z.object({
    idToken: z.string({ error: 'Missing or invalid Apple identityToken' }).min(1).max(20_000),
    rawNonce: z.string().min(1).max(1_024),
    name: appleNameInputSchema.optional(),
    email: z.email().max(254).nullable(),
  }),
});

export const appleOAuthContract = { request: appleOAuthRequestSchema } satisfies Contract;

/** Represents the apple oauth body value. */
export type AppleOAuthBody = BodyOf<typeof appleOAuthContract>;
