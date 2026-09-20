import { Injectable } from '@nestjs/common';
import type { LoginUser, RotatedSession } from '../../core/application/models/auth.models';
import { SessionRepository } from '../application/ports/session.repository';
import { SessionSql } from './session.sql';

/** PostgreSQL session repository. */
@Injectable()
export class PostgresSessionRepository implements SessionRepository {
  constructor(private readonly sql: SessionSql) {}

  findLoginUser(identifier: string): Promise<LoginUser | null> {
    return this.sql.findLoginUser(identifier);
  }

  findLastLogin(userId: string): Promise<Date | null> {
    return this.sql.findLastLogin(userId);
  }

  rotate(userId: string): Promise<RotatedSession> {
    return this.sql.rotate(userId);
  }

  rotateIfVersion(userId: string, previousTokenVersion: number): Promise<RotatedSession | null> {
    return this.sql.rotateIfVersion(userId, previousTokenVersion);
  }

  findTokenVersion(userId: string): Promise<number | null> {
    return this.sql.findTokenVersion(userId);
  }

  clearPushToken(userId: string): Promise<void> {
    return this.sql.clearPushToken(userId);
  }

  logout(userId: string): Promise<void> {
    return this.sql.logout(userId);
  }
}
