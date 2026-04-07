import type { SaveUserPushTokenBody } from '../../../types/api/user/requests.ts';
import { querySaveUserPushToken } from './user.push-tokens.queries.ts';

export const saveUserPushTokenData = async (userId: string, body: SaveUserPushTokenBody): Promise<void> => {
  await querySaveUserPushToken(userId, body.token);
};
