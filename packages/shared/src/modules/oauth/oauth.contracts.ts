import { z } from 'zod/v4';
import type { Contract, ResponseOf } from '../../common';
import { loginResponseSchema } from '../auth/session/session.contracts';

// Complete OAuth login

export const oAuthLoginResponseSchema = z.object({
  message: z.string(),
  user: z.string().uuid(),
  accessToken: z.string(),
  refreshToken: z.string(),
});
export const proceedLoginResponseSchema = loginResponseSchema;

export const oAuthLoginContract = { response: oAuthLoginResponseSchema } satisfies Contract;

/** Represents the oauth login response value. */
export type OAuthLoginResponse = ResponseOf<typeof oAuthLoginContract>;
