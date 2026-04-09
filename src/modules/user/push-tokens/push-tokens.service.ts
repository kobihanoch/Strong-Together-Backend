import type { SaveUserPushTokenBody } from '@strong-together/shared';
import { querySaveUserPushToken } from './push-tokens.queries.ts';

export const saveUserPushTokenData = async (userId: string, body: SaveUserPushTokenBody): Promise<void> => {
  await querySaveUserPushToken(userId, body.token);
};
