import z from 'zod';
import { oAuthLoginResponseSchema } from '../../../validators/oAuth/oAuthLoginResponse.schema.ts';
import { proceedLoginResponseSchema } from '../../../validators/oAuth/proceedLoginResponse.schema.ts';

export type OAuthLoginResponse = z.infer<typeof oAuthLoginResponseSchema>;
export type ProceedLoginResponse = z.infer<typeof proceedLoginResponseSchema>;
