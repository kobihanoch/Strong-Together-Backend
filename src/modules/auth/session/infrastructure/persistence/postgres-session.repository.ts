import { Injectable } from '@nestjs/common';
import { LogoutSql } from './writes/logout.sql';
import { ClearPushTokenSql } from './writes/clear-push-token.sql';
import { FindTokenVersionSql } from './writes/find-token-version.sql';
import { RotateIfVersionSql } from './writes/rotate-if-version.sql';
import { RotateSql } from './writes/rotate.sql';
import { FindLastLoginSql } from './writes/find-last-login.sql';
import { FindLoginUserSql } from './writes/find-login-user.sql';
import type { LoginUser, RotatedSession } from '../../../core/application/models/auth.models';
import { SessionRepository } from '../../application/ports/session.repository';

/** PostgreSQL session repository. */
@Injectable()
export class PostgresSessionRepository implements SessionRepository {
  public constructor(
    private readonly findLoginUserSql: FindLoginUserSql,
    private readonly findLastLoginSql: FindLastLoginSql,
    private readonly rotateSql: RotateSql,
    private readonly rotateIfVersionSql: RotateIfVersionSql,
    private readonly findTokenVersionSql: FindTokenVersionSql,
    private readonly clearPushTokenSql: ClearPushTokenSql,
    private readonly logoutSql: LogoutSql,
  ) {}

  findLoginUser(identifier: string): Promise<LoginUser | null> {
    return this.findLoginUserSql.findLoginUser(identifier);
  }

  findLastLogin(userId: string): Promise<Date | null> {
    return this.findLastLoginSql.findLastLogin(userId);
  }

  rotate(userId: string): Promise<RotatedSession> {
    return this.rotateSql.rotate(userId);
  }

  rotateIfVersion(userId: string, previousTokenVersion: number): Promise<RotatedSession | null> {
    return this.rotateIfVersionSql.rotateIfVersion(userId, previousTokenVersion);
  }

  findTokenVersion(userId: string): Promise<number | null> {
    return this.findTokenVersionSql.findTokenVersion(userId);
  }

  clearPushToken(userId: string): Promise<void> {
    return this.clearPushTokenSql.clearPushToken(userId);
  }

  logout(userId: string): Promise<void> {
    return this.logoutSql.logout(userId);
  }
}
