import z from 'zod/v4';
import { saveUserPushTokenRequest } from './push-tokens.schemas';

export type SaveUserPushTokenBody = z.infer<typeof saveUserPushTokenRequest.shape.body>;
