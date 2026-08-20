import z from 'zod/v4';
import { googleOAuthRequest } from './google.schemas';

export type GoogleOAuthBody = z.infer<typeof googleOAuthRequest.shape.body>;
