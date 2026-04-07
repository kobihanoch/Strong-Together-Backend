export interface UserReminderSettingsEntity {
  user_id: string;
  workout_reminders_enabled: boolean;
  reminder_offset_minutes: number;
  updated_at: string;
  timezone: string | null;
}
