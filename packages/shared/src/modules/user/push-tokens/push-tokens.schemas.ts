import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';

export const saveUserPushTokenRequest = z.object({
  body: z.object({
    token: userDbSchema.shape.pushToken.unwrap(),
  }),
});
