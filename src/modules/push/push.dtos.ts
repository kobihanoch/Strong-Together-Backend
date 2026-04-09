export type NotificationPayload = {
  token: string;
  title: string;
  body: string;
  delay?: number;
  expiresAt: number;
  requestId?: string;
};

export type UserToHourlyReminder = {
  user_id: string;
  name: string | null;
  push_token: string | null;
  reminder_offset_minutes: number;
  split_id: number;
  split_name: string | null;
  estimated_time_utc: string;
};

export type UserWithNotificationsEnabled = {
  push_token: string | null;
  name: string | null;
};
