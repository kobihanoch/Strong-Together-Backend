import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { AerobicEntrySqlInput } from '../aerobics.db-types';

@Injectable()
export class CreateSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Adds aerobic tracking.
   *
   * @param record - The aerobic tracking record.
   * @returns A promise that resolves when the operation completes.
   */
  async create(record: AerobicEntrySqlInput) {
    const { durationMins, durationSec, type } = record;
    const [created] = await this.dbService.sql<{ id: number }[]>`
      INSERT INTO
        tracking.aerobic_tracking (user_id, type, duration_sec)
      VALUES
        (
          identity.current_user_id (),
          ${type},
          ${durationMins * 60 + durationSec}
        )
      RETURNING
        id
    `;
    return created;
  }
}
