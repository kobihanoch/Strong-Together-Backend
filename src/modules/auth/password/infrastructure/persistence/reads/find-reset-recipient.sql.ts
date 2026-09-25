import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { PasswordResetRecipientSqlRow } from '../password.db-types';

@Injectable()
export class FindResetRecipientSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Executes the find reset recipient SQL operation.
   *
   * @param identifier - The identifier value.
   * @returns The query result.
   */
  async findResetRecipient(identifier: string) {
    const [row] = await this.dbService.sql<PasswordResetRecipientSqlRow[]>`
      SELECT
        guest_api.find_login_user (${identifier}) AS "userData"
    `;
    return row?.userData ?? null;
  }
}
