import { z } from 'zod/v4';
import type { BodyOf, Contract } from '../../../common';
import { userDbSchema } from '../../../database';

// Replace current user's push token

export const replacePushTokenRequestSchema = z.object({
  body: z.object({ token: userDbSchema.shape.pushToken.unwrap() }),
});

export const replacePushTokenContract = { request: replacePushTokenRequestSchema } satisfies Contract;

export type ReplacePushTokenBody = BodyOf<typeof replacePushTokenContract>;
