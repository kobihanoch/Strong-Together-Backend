import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { UserExistsSqlRow } from '../create-user.db-types';
/** Executes registration persistence queries. */

@Injectable()
export class ExistsSql {
  constructor(private readonly db: DBService) {}
  /**
   * Executes the exists SQL operation.
   *
   * @param username - The username value.
   * @param email - The normalized email address.
   * @returns The query result.
   */
  async exists(username: string, email: string) {
    const [row] = await this.db.sql<UserExistsSqlRow[]>`
      SELECT
        guest_api.user_exists (
          ${username},
          ${email}
        ) AS id
    `;
    return Boolean(row?.id);
  }
}
