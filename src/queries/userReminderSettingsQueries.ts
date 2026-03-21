import sql from '../config/db.ts';

export async function queryCreateUserDefaultReminderSettings(userId: string): Promise<void> {
  await sql`INSERT INTO user_reminder_settings (user_id) VALUES (${userId}::uuid)`;
}
