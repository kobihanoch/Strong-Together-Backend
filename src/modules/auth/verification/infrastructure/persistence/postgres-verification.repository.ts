import { Injectable } from '@nestjs/common';
import { UpdateEmailSql } from './writes/update-email.sql';
import { UpdateVerificationSql } from './writes/update-verification.sql';
import { EmailExistsSql } from './reads/email-exists.sql';
import { FindByUsernameSql } from './reads/find-by-username.sql';
import { FindByEmailSql } from './reads/find-by-email.sql';
import type { AuthEmailRecipient } from '../../../core/application/models/auth.models';
import { AuthAccount } from '../../../core/domain/entities/auth-account';
import { VerificationRepository } from '../../application/ports/verification.repository';
import type { VerificationEmail } from '../../domain/value-objects/verification-email';

/** PostgreSQL account-verification repository. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresVerificationRepository implements VerificationRepository {
  public constructor(
    private readonly findByEmailSql: FindByEmailSql,
    private readonly findByUsernameSql: FindByUsernameSql,
    private readonly emailExistsSql: EmailExistsSql,
    private readonly updateVerificationSql: UpdateVerificationSql,
    private readonly updateEmailSql: UpdateEmailSql,
  ) {}
  async findByEmail(email: VerificationEmail): Promise<AuthEmailRecipient | undefined> {
    return this.findByEmailSql.findByEmail(email.value);
  }
  async findByUsername(username: string): Promise<AuthAccount | undefined> {
    const user = await this.findByUsernameSql.findByUsername(username);
    return user ? AuthAccount.restore(user) : undefined;
  }
  emailExists(email: VerificationEmail): Promise<boolean> {
    return this.emailExistsSql.emailExists(email.value);
  }
  updateVerification(userId: string, verified: boolean): Promise<void> {
    return this.updateVerificationSql.updateVerification(userId, verified);
  }
  updateEmail(userId: string, email: VerificationEmail): Promise<void> {
    return this.updateEmailSql.updateEmail(userId, email.value);
  }
}
