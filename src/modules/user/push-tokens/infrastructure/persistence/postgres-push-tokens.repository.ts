import { Injectable } from '@nestjs/common';
import { ReplaceSql } from './writes/replace.sql';
import { PushTokensRepository } from '../../application/ports/push-tokens.repository';
import type { DevicePushToken } from '../../domain/value-objects/device-push-token';
/** PostgreSQL adapter for user push tokens. */
@Injectable()
export class PostgresPushTokensRepository implements PushTokensRepository {
  public constructor(private readonly replaceSql: ReplaceSql) {}
  replace(userId: string, token: DevicePushToken): Promise<void> {
    return this.replaceSql.replace(userId, token.value);
  }
}
