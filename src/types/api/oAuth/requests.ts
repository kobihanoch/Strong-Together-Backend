import z from 'zod';
import { googleOAuthRequest } from '../../../modules/oauth/google/oauth.google.schemas.ts';
import { appleOAuthRequest } from '../../../modules/oauth/apple/oauth.apple.schemas.ts';

export type GoogleOAuthBody = z.infer<typeof googleOAuthRequest.shape.body>;
export type AppleOAuthBody = z.infer<typeof appleOAuthRequest.shape.body>;
