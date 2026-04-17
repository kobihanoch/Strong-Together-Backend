import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens.ts';

@Injectable()
export class PushTokensQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async querySaveUserPushToken(userId: string, token: string): Promise<void> {
    await this.sql`UPDATE users SET push_token=${token} WHERE id=${userId}::uuid`;
  }
}
