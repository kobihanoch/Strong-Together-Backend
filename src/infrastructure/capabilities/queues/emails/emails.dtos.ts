/** Represents the email payload value. */
export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  expiresAt?: number;
  requestId?: string;
};
