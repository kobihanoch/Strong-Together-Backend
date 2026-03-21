import z from 'zod';
import { googleOAuthRequest } from '../../../validators/oAuth/googleOAuthRequest.schema.ts';
import { appleOAuthRequest } from '../../../validators/oAuth/appleOAuthRequest.schema.ts';

export type GoogleOAuthBody = z.infer<typeof googleOAuthRequest.shape.body>;
export type AppleOAuthBody = z.infer<typeof appleOAuthRequest.shape.body>;
