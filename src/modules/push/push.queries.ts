import { Inject, Injectable } from '@nestjs/common';
import { UserToHourlyReminder, UserWithNotificationsEnabled } from './push.dtos';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

@Injectable()
export class PushQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryGetAllUsersWithNotificationsEnabled(): Promise<UserWithNotificationsEnabled[]> {
    const rows = await this.sql<UserWithNotificationsEnabled[]>`
      SELECT push_token, name FROM identity.users WHERE push_token IS NOT NULL`;

    return rows as UserWithNotificationsEnabled[];
  }

  async queryGetAllUsersToSendHourlyReminder(): Promise<UserToHourlyReminder[]> {
    const users = await this.sql<UserToHourlyReminder[]>`
      SELECT
        u.id AS user_id,
        u.name AS name,
        u.push_token,
        rs.reminder_offset_minutes,
        usi.split_id,
        ws.name AS split_name,
        usi.estimated_time_utc
      FROM identity.users AS u
      JOIN reminders.user_reminder_settings AS rs
        ON rs.user_id = u.id
      JOIN reminders.user_split_information AS usi
        ON usi.user_id = u.id
      JOIN workout.workoutsplits AS ws
        ON usi.split_id = ws.id
      WHERE rs.workout_reminders_enabled = TRUE
        AND u.push_token IS NOT NULL
        AND u.push_token <> ''
        AND usi.confidence >= 0.60
        AND usi.preferred_weekday = EXTRACT(DOW FROM TIMEZONE('UTC', NOW()))
    `;

    return users as UserToHourlyReminder[];
  }
}
