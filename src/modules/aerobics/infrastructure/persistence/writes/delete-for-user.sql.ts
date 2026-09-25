import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { AerobicMutationSqlRow } from '../aerobics.db-types';

@Injectable()
export class DeleteForUserSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Deletes an aerobic entry owned by the authenticated user.
   *
   * @param userId - The authenticated user's identifier.
   * @param id - The aerobic entry identifier.
   * @returns The deleted entry identifier, or `null` when it was not found.
   */
  async deleteForUser(userId: string, id: number) {
    const [row] = await this.dbService.sql<AerobicMutationSqlRow[]>`
      DELETE FROM tracking.aerobic_tracking
      WHERE
        id = ${id}::BIGINT
        AND user_id = ${userId}::UUID
      RETURNING
        id
    `;
    return row ? { kind: 'deleted' as const, id: row.id } : { kind: 'not-found' as const };
  }
}
