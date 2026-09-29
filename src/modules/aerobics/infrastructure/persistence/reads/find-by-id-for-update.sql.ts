import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { AerobicEntrySqlRow } from '../aerobics.db-types';

@Injectable()
export class FindByIdForUpdateSql {
  constructor(private readonly dbService: DBService) {}

  async findByIdForUpdate(userId: string, id: number) {
    const [entry] = await this.dbService.sql<AerobicEntrySqlRow[]>`
      SELECT
        id,
        type,
        (duration_sec / 60)::INT AS "durationMins",
        (duration_sec % 60)::INT AS "durationSec"
      FROM
        tracking.aerobic_tracking
      WHERE
        id = ${id}::BIGINT
        AND user_id = ${userId}::UUID
      FOR UPDATE
    `;
    return entry;
  }
}
