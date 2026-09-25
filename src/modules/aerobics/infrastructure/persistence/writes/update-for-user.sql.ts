import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { AerobicMutationSqlRow } from '../aerobics.db-types';

@Injectable()
export class UpdateForUserSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Updates an aerobic entry owned by the authenticated user.
   *
   * @param userId - The authenticated user's identifier.
   * @param id - The aerobic entry identifier.
   * @param record - The replacement aerobic entry values.
   * @returns The updated entry identifier, or `null` when it was not found.
   */
  async updateForUser(userId: string, id: number, record: { durationMins: number; durationSec: number; type: string }) {
    const { durationMins, durationSec, type } = record;
    const [row] = await this.dbService.sql<AerobicMutationSqlRow[]>`
      UPDATE tracking.aerobic_tracking
      SET
        type = ${type},
        duration_sec = ${durationMins * 60 + durationSec}
      WHERE
        id = ${id}::BIGINT
        AND user_id = ${userId}::UUID
      RETURNING
        id
    `;
    return row ? { kind: 'updated' as const, id: row.id } : { kind: 'not-found' as const };
  }
}
