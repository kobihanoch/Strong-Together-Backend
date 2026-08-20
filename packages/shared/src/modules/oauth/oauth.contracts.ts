import z from 'zod/v4';
import { oAuthLoginResponseSchema } from './oauth.schemas';

export type OAuthLoginResponse = z.infer<typeof oAuthLoginResponseSchema>;
