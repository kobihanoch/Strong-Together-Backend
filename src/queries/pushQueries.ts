import sql from '../config/db.ts';
import { UserToHourlyReminder, UserWithNotificationsEnabled } from '../types/dto/notifications.dto.ts';

export const queryGetAllUsersWithNotificationsEnabled = async (): Promise<UserWithNotificationsEnabled[]> => {
  const rows = await sql<UserWithNotificationsEnabled[]>`
    SELECT push_token, name FROM users WHERE push_token IS NOT NULL`;

  return rows as UserWithNotificationsEnabled[];
};

export const queryGetAllUsersToSendHourlyReminder = async (): Promise<UserToHourlyReminder[]> => {
  const users = await sql<UserToHourlyReminder[]>`
    SELECT
      u.id AS user_id,
      u.name AS name,
      u.push_token,
      rs.reminder_offset_minutes,
      usi.split_id,
      ws.name AS split_name,
      usi.estimated_time_utc
    FROM public.users AS u
    JOIN public.user_reminder_settings AS rs
      ON rs.user_id = u.id
    JOIN public.user_split_information AS usi
      ON usi.user_id = u.id
    JOIN public.workoutsplits AS ws
      ON usi.split_id = ws.id
    WHERE rs.workout_reminders_enabled = TRUE
      AND u.push_token IS NOT NULL
      AND u.push_token <> ''
      AND usi.confidence >= 0.60
      AND usi.preferred_weekday = EXTRACT(DOW FROM TIMEZONE('UTC', NOW()))
  `;

  return users as UserToHourlyReminder[];
};
