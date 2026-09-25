import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';

@Injectable()
export class CreateForUserSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Adds aerobic tracking.
   *
   * @param userId - The user identifier.
   * @param record - The aerobic tracking record.
   * @returns A promise that resolves when the operation completes.
   */
  async createForUser(userId: string, record: { durationMins: number; durationSec: number; type: string }) {
    const { durationMins, durationSec, type } = record;
    await this.dbService.sql`
      INSERT INTO
        tracking.aerobic_tracking (user_id, type, duration_sec)
      VALUES
        (
          ${userId}::UUID,
          ${type},
          ${durationMins * 60 + durationSec}
        )
    `;
  }
}
