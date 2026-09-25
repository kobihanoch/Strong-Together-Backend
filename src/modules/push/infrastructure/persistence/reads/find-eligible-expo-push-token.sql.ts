import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../infrastructure/connections/postgres/db.service';
import type { EligiblePushTokenSqlRow } from '../push.db-types';

@Injectable()
export class FindEligibleExpoPushTokenSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves the user's current Expo push token when the queued reminder is still eligible.
   *
   * @param userId - The reminder owner's identifier.
   * @param workoutScheduleId - The queued schedule identifier.
   * @param occurrenceDate - The queued local workout date.
   * @returns The current Expo token, or null when the delayed reminder is no longer eligible.
   */
  async findEligibleExpoPushToken(userId: string, workoutScheduleId: string, occurrenceDate: string): Promise<string | null> {
    const [row] = await this.dbService.sql<EligiblePushTokenSqlRow[]>`
      SELECT
        cron_api.valid_workout_reminder_token (
          ${userId}::UUID,
          ${workoutScheduleId}::UUID,
          ${occurrenceDate}::DATE
        ) AS "pushToken"
    `;

    return row?.pushToken ?? null;
  }
}
