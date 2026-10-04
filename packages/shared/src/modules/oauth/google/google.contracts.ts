import { z } from 'zod/v4';
import type { BodyOf, Contract } from '../../../common';

// Sign in with Google

export const googleOAuthRequestSchema = z.object({ body: z.object({ idToken: z.string().min(1).max(20_000).optional() }) });

export const googleOAuthContract = { request: googleOAuthRequestSchema } satisfies Contract;

/** Represents the google oauth body value. */
export type GoogleOAuthBody = BodyOf<typeof googleOAuthContract>;
