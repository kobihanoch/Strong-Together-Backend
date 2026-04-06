import z from 'zod';
import { googleOAuthRequest } from '../../../features/oauth/googleOAuthRequest.schema.ts';
import { appleOAuthRequest } from '../../../features/oauth/appleOAuthRequest.schema.ts';

export type GoogleOAuthBody = z.infer<typeof googleOAuthRequest.shape.body>;
export type AppleOAuthBody = z.infer<typeof appleOAuthRequest.shape.body>;
