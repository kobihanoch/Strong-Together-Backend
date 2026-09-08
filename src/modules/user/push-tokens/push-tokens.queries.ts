import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class PushTokensQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Saves user push token.
   * @param userId - The user identifier.
   * @param token - The token to process.
   */
  async querySaveUserPushToken(userId: string, token: string): Promise<void> {
    await this.sql`UPDATE identity.user SET push_token=${token} WHERE id=${userId}::uuid`;
  }
}
