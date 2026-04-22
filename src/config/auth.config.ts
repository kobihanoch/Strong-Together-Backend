import './app.config';

export const authConfig = {
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  jwtVerifySecret: process.env.JWT_VERIFY_SECRET as string,
  jwtForgotPasswordSecret: process.env.JWT_FORGOT_PASSWORD_SECRET as string,
  changeEmailSecret: process.env.CHANGE_EMAIL_SECRET as string,
  jwtSocketSecret: process.env.JWT_SOCKET_SECRET as string,
  appleAllowedAuds: (process.env.APPLE_ALLOWED_AUDS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
};
