import { Injectable } from '@nestjs/common';
import { UpdateEmailSql } from './writes/update-email.sql';
import { UpdateVerificationSql } from './writes/update-verification.sql';
import { EmailExistsSql } from './writes/email-exists.sql';
import { FindByUsernameSql } from './writes/find-by-username.sql';
import { FindByEmailSql } from './writes/find-by-email.sql';
import type { AuthEmailRecipient, LoginUser } from '../../../core/application/models/auth.models';
import { VerificationRepository } from '../../application/ports/verification.repository';

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
  findByEmail(email: string): Promise<AuthEmailRecipient | null> {
    return this.findByEmailSql.findByEmail(email);
  }
  findByUsername(username: string): Promise<LoginUser | null> {
    return this.findByUsernameSql.findByUsername(username);
  }
  emailExists(email: string): Promise<boolean> {
    return this.emailExistsSql.emailExists(email);
  }
  updateVerification(userId: string, verified: boolean): Promise<void> {
    return this.updateVerificationSql.updateVerification(userId, verified);
  }
  updateEmail(userId: string, email: string): Promise<void> {
    return this.updateEmailSql.updateEmail(userId, email);
  }
}
