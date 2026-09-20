import { Injectable } from '@nestjs/common';
import type { AuthEmailRecipient, LoginUser } from '../../core/application/models/auth.models';
import { VerificationRepository } from '../application/ports/verification.repository';
import { VerificationSql } from './verification.sql';

/** PostgreSQL account-verification repository. */
@Injectable()
export class PostgresVerificationRepository implements VerificationRepository {
  constructor(private readonly sql: VerificationSql) {}

  findByEmail(email: string): Promise<AuthEmailRecipient | null> {
    return this.sql.findByEmail(email);
  }

  findByUsername(username: string): Promise<LoginUser | null> {
    return this.sql.findByUsername(username);
  }

  emailExists(email: string): Promise<boolean> {
    return this.sql.emailExists(email);
  }

  updateVerification(userId: string, verified: boolean): Promise<void> {
    return this.sql.updateVerification(userId, verified);
  }

  updateEmail(userId: string, email: string): Promise<void> {
    return this.sql.updateEmail(userId, email);
  }

  getVerificationStatus(username: string): Promise<boolean> {
    return this.sql.getVerificationStatus(username);
  }
}
