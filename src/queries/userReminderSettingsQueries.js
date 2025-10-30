import sql from "../config/db.js";

export async function queryCreateUserDefaultReminderSettings(userId) {
  await sql`INSERT INTO user_reminder_settings (user_id) VALUES (${userId})`;
}
