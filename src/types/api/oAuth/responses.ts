import z from 'zod';
import { oAuthLoginResponseSchema } from '../../../features/oauth/oAuthLoginResponse.schema.ts';
import { proceedLoginResponseSchema } from '../../../features/oauth/proceedLoginResponse.schema.ts';

export type OAuthLoginResponse = z.infer<typeof oAuthLoginResponseSchema>;
export type ProceedLoginResponse = z.infer<typeof proceedLoginResponseSchema>;
