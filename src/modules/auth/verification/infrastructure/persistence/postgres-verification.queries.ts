import { Injectable } from '@nestjs/common';
import { GetVerificationStatusSql } from './reads/get-verification-status.sql';
import { VerificationQueries } from '../../application/ports/verification.queries';

/** PostgreSQL account-verification repository. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresVerificationQueries implements VerificationQueries {
  public constructor(private readonly getVerificationStatusSql: GetVerificationStatusSql) {}
  getVerificationStatus(username: string): Promise<boolean> {
    return this.getVerificationStatusSql.getVerificationStatus(username);
  }
}
