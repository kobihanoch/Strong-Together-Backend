import { z } from 'zod/v4';
import type { BodyOf, Contract } from '../../../common';

// Sign in with Google

export const googleOAuthRequestSchema = z.object({ body: z.object({ idToken: z.string().optional() }) });

export const googleOAuthContract = { request: googleOAuthRequestSchema } satisfies Contract;

export type GoogleOAuthBody = BodyOf<typeof googleOAuthContract>;
