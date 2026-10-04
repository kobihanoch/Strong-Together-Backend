import { z } from 'zod/v4';
import type { BodyOf, Contract } from '../../../common';

// Replace current user's push token

export const replacePushTokenRequestSchema = z.object({
  body: z.object({ token: z.string().trim().min(1).max(4_096) }),
});

export const replacePushTokenContract = { request: replacePushTokenRequestSchema } satisfies Contract;

/** Represents the replace push token body value. */
export type ReplacePushTokenBody = BodyOf<typeof replacePushTokenContract>;
