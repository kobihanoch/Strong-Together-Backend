import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { AerobicMutationSqlRow } from '../aerobics.db-types';

@Injectable()
export class DeleteSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Deletes an aerobic entry owned by the authenticated user.
   *
   * @param id - The aerobic entry identifier.
   * @returns The deleted entry identifier, or `null` when it was not found.
   */
  async delete(id: number) {
    const [row] = await this.dbService.sql<AerobicMutationSqlRow[]>`
      DELETE FROM tracking.aerobic_tracking
      WHERE
        id = ${id}::BIGINT
        AND user_id = identity.current_user_id ()
      RETURNING
        id
    `;
    return row !== undefined;
  }
}
