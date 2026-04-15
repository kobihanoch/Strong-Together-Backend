import { Injectable } from '@nestjs/common';
import type { SaveUserPushTokenBody } from '@strong-together/shared';
import { querySaveUserPushToken } from './push-tokens.queries.ts';

@Injectable()
export class PushTokensService {
  async saveUserPushTokenData(userId: string, body: SaveUserPushTokenBody): Promise<void> {
    await querySaveUserPushToken(userId, body.token);
  }
}
