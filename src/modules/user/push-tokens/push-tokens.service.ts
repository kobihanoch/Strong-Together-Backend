import { Injectable } from '@nestjs/common';
import type { ReplacePushTokenBody } from '@strong-together/shared';
import { PushTokensQueries } from './push-tokens.queries';

@Injectable()
export class PushTokensService {
  constructor(private readonly pushTokensQueries: PushTokensQueries) {}

  /**
   * Saves user push token.
   * @param userId - The user identifier.
   * @param body - The validated request body.
   */
  async replacePushTokenData(userId: string, body: ReplacePushTokenBody): Promise<void> {
    await this.pushTokensQueries.querySaveUserPushToken(userId, body.token);
  }
}
