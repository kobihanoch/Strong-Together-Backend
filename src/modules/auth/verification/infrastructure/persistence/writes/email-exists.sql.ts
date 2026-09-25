import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { EmailExistsSqlRow } from '../verification.db-types';

@Injectable()
export class EmailExistsSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Executes the email exists SQL operation.
   *
   * @param email - The normalized email address.
   * @returns The query result.
   */
  async emailExists(email: string): Promise<boolean> {
    const [row] = await this.dbService.sql<EmailExistsSqlRow[]>`
      SELECT
        guest_api.user_exists (NULL, ${email}) AS id
    `;
    return Boolean(row?.id);
  }
}
