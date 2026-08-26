import { Inject, Injectable } from '@nestjs/common';
import type { UserToHourlyReminderQueryDto, UserWithNotificationsEnabledQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

@Injectable()
export class PushQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Retrieves all users with notifications enabled.
   * @returns The all users with notifications enabled result.
   */
  async queryGetAllUsersWithNotificationsEnabled(): Promise<UserWithNotificationsEnabledQueryDto[]> {
    const rows = await this.sql<UserWithNotificationsEnabledQueryDto[]>`
      SELECT push_token AS "pushToken", name FROM identity.user WHERE push_token IS NOT NULL`;

    return rows;
  }

  /**
   * Retrieves all users to send hourly reminder.
   * @returns The all users to send hourly reminder result.
   */
  async queryGetAllUsersToSendHourlyReminder(): Promise<UserToHourlyReminderQueryDto[]> {
    const users = await this.sql<UserToHourlyReminderQueryDto[]>`
      SELECT
        u.id AS "userId",
        u.name AS name,
        u.push_token AS "pushToken",
        rs.reminder_offset_minutes AS "reminderOffsetMinutes",
        usi.workout_split_id AS "splitId",
        ws.name AS "splitName",
        usi.estimated_time_utc AS "estimatedTimeUtc"
      FROM identity.user AS u
      JOIN reminders.user_reminder_setting AS rs
        ON rs.user_id = u.id
      JOIN reminders.user_split_information AS usi
        ON usi.user_id = u.id
      JOIN workout.workout_split AS ws
        ON usi.workout_split_id = ws.id
      WHERE rs.workout_reminders_enabled = TRUE
        AND u.push_token IS NOT NULL
        AND u.push_token <> ''
        AND usi.confidence >= 0.60
        AND usi.preferred_weekday = EXTRACT(DOW FROM TIMEZONE('UTC', NOW()))
    `;

    return users;
  }
}
