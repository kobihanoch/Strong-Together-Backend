import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { AerobicEntrySqlInput, AerobicMutationSqlRow } from '../aerobics.db-types';

@Injectable()
export class SaveSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Updates an aerobic entry owned by the authenticated user.
   *
   * @param id - The aerobic entry identifier.
   * @param record - The replacement aerobic entry values.
   * @returns The updated entry identifier, or `null` when it was not found.
   */
  async save(id: number, record: AerobicEntrySqlInput) {
    const { durationMins, durationSec, type } = record;
    const [row] = await this.dbService.sql<AerobicMutationSqlRow[]>`
      UPDATE tracking.aerobic_tracking
      SET
        type = ${type},
        duration_sec = ${durationMins * 60 + durationSec}
      WHERE
        id = ${id}::BIGINT
        AND user_id = identity.current_user_id ()
      RETURNING
        id
    `;
    return row !== undefined;
  }
}
