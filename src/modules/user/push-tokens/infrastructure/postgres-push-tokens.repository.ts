import { Injectable } from '@nestjs/common';
import { PushTokensRepository } from '../application/ports/push-tokens.repository';
import { PushTokensSql } from './push-tokens.sql';
/** PostgreSQL adapter for user push tokens. */
@Injectable()
export class PostgresPushTokensRepository implements PushTokensRepository {
  constructor(private readonly sql: PushTokensSql) {}
  replace(userId: string, token: string): Promise<void> {
    return this.sql.replace(userId, token);
  }
}
