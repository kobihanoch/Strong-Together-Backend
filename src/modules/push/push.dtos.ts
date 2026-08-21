export type NotificationPayload = {
  token: string;
  title: string;
  body: string;
  delay?: number;
  expiresAt: number;
  requestId?: string;
};
