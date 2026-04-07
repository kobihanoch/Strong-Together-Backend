export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  expiresAt?: number;
  requestId?: string;
};

export type ValidateUserEmailParams = {
  fullName: string;
  verifyUrl: string;
  logoUrl: string;
};

export type ForgotPasswordEmailParams = {
  fullName: string;
  changePasswordUrl: string;
  logoUrl: string;
};

export type ConfirmEmailChangeParams = {
  fullName: string;
  confirmUrl: string;
  logoUrl: string;
};
