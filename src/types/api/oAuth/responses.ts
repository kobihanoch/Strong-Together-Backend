import z from 'zod';
import { oAuthLoginResponseSchema, proceedLoginResponseSchema } from '../../../modules/oauth/oauth.schemas.ts';

export type OAuthLoginResponse = z.infer<typeof oAuthLoginResponseSchema>;
export type ProceedLoginResponse = z.infer<typeof proceedLoginResponseSchema>;
