import { Injectable } from '@nestjs/common';
import { UpdatePasswordSql } from './writes/update-password.sql';
import { FindResetRecipientSql } from './reads/find-reset-recipient.sql';
import type { AuthEmailRecipient } from '../../../core/application/models/auth.models';
import { PasswordRepository } from '../../application/ports/password.repository';

/** PostgreSQL password repository. */
@Injectable()
export class PostgresPasswordRepository implements PasswordRepository {
  public constructor(
    private readonly findResetRecipientSql: FindResetRecipientSql,
    private readonly updatePasswordSql: UpdatePasswordSql,
  ) {}

  findResetRecipient(identifier: string): Promise<AuthEmailRecipient | null> {
    return this.findResetRecipientSql.findResetRecipient(identifier);
  }

  updatePassword(userId: string, passwordHash: string): Promise<void> {
    return this.updatePasswordSql.updatePassword(userId, passwordHash);
  }
}
