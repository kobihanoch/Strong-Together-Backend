import { z } from 'zod/v4';
import type { Contract, ResponseOf } from '../../common';
import { userDbSchema } from '../../database';
import { loginResponseSchema } from '../auth/session/session.contracts';

// Complete OAuth login

export const oAuthLoginResponseSchema = z.object({
  message: z.string(),
  user: userDbSchema.shape.id,
  accessToken: z.string(),
  refreshToken: z.string(),
  missingFields: z.array(z.string()).nullable(),
});
export const proceedLoginResponseSchema = loginResponseSchema;

export const oAuthLoginContract = { response: oAuthLoginResponseSchema } satisfies Contract;

export type OAuthLoginResponse = ResponseOf<typeof oAuthLoginContract>;
