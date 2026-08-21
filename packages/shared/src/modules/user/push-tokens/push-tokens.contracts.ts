import { z } from 'zod/v4';
import type { BodyOf, Contract } from '../../../common';
import { userDbSchema } from '../../../database';

// Save user push token

export const saveUserPushTokenRequestSchema = z.object({
  body: z.object({ token: userDbSchema.shape.pushToken.unwrap() }),
});

export const saveUserPushTokenContract = { request: saveUserPushTokenRequestSchema } satisfies Contract;

export type SaveUserPushTokenBody = BodyOf<typeof saveUserPushTokenContract>;
