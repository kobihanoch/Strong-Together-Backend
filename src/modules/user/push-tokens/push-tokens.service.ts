import { Injectable } from '@nestjs/common';
import type { SaveUserPushTokenBody } from '@strong-together/shared';
import { PushTokensQueries } from './push-tokens.queries.ts';

@Injectable()
export class PushTokensService {
  constructor(private readonly pushTokensQueries: PushTokensQueries) {}

  async saveUserPushTokenData(userId: string, body: SaveUserPushTokenBody): Promise<void> {
    await this.pushTokensQueries.querySaveUserPushToken(userId, body.token);
  }
}
