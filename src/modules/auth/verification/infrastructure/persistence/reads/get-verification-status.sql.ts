import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { VerificationStatusSqlRow } from '../verification.db-types';

@Injectable()
export class GetVerificationStatusSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Executes the get verification status SQL operation.
   *
   * @param username - The username value.
   * @returns The query result.
   */
  async getVerificationStatus(username: string) {
    const [row] = await this.dbService.sql<VerificationStatusSqlRow[]>`
      SELECT
        guest_api.verification_state (${username}) AS is_verified
    `;
    return row?.is_verified ?? false;
  }
}
