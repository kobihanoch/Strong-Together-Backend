import { Injectable } from '@nestjs/common';
import type { AuthEmailRecipient } from '../../../core/application/models/auth.models';
import { PasswordResetQueries } from '../../application/ports/password-reset.queries';
import type { PasswordResetRequest } from '../../domain/entities/password-reset-request';
import { FindResetRecipientSql } from './reads/find-reset-recipient.sql';

@Injectable()
export class PostgresPasswordResetQueries implements PasswordResetQueries {
  constructor(private readonly findResetRecipientSql: FindResetRecipientSql) {}

  findRecipient(request: PasswordResetRequest): Promise<AuthEmailRecipient | undefined> {
    return this.findResetRecipientSql.findResetRecipient(request.identifier);
  }
}
