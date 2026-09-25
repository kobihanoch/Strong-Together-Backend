import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { VerificationRecipientSqlRow } from '../verification.db-types';

@Injectable()
export class FindByEmailSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Executes the find by email SQL operation.
   *
   * @param email - The normalized email address.
   * @returns The query result.
   */
  async findByEmail(email: string) {
    const [row] = await this.dbService.sql<VerificationRecipientSqlRow[]>`
      SELECT
        guest_api.find_user_for_email (${email}) AS "userData"
    `;
    return row?.userData ? { ...row.userData, email } : null;
  }
}
