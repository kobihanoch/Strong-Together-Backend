import { Injectable } from '@nestjs/common';
import type { AuthEmailRecipient } from '../../core/application/models/auth.models';
import { PasswordRepository } from '../application/ports/password.repository';
import { PasswordSql } from './password.sql';

/** PostgreSQL password repository. */
@Injectable()
export class PostgresPasswordRepository implements PasswordRepository {
  constructor(private readonly sql: PasswordSql) {}

  findResetRecipient(identifier: string): Promise<AuthEmailRecipient | null> {
    return this.sql.findResetRecipient(identifier);
  }

  updatePassword(userId: string, passwordHash: string): Promise<void> {
    return this.sql.updatePassword(userId, passwordHash);
  }
}
