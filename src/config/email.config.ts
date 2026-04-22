import './app.config';

export const emailConfig = {
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  maildevApiUrl: process.env.MAILDEV_API_URL ?? 'http://127.0.0.1:1080',
  maildevSmtpHost: process.env.MAILDEV_SMTP_HOST ?? '127.0.0.1',
  maildevSmtpPort: Number(process.env.MAILDEV_SMTP_PORT ?? 1025),
};
