import z from 'zod/v4';
import { appleOAuthRequest } from './apple.schemas';

export type AppleOAuthBody = z.infer<typeof appleOAuthRequest.shape.body>;
