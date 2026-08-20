export type NotificationPayload = {
  token: string;
  title: string;
  body: string;
  delay?: number;
  expiresAt: number;
  requestId?: string;
};

export type UserToHourlyReminder = {
  userId: string;
  name: string | null;
  pushToken: string | null;
  reminderOffsetMinutes: number;
  splitId: number;
  splitName: string | null;
  estimatedTimeUtc: string;
};

export type UserWithNotificationsEnabled = {
  pushToken: string | null;
  name: string | null;
};
