import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../../config/auth.config';

export function createVerifyToken(userId: string) {
  return jwt.sign(
    {
      sub: userId,
      typ: 'email-verify',
      jti: `verify-${crypto.randomUUID()}`,
      iss: 'strong-together',
    },
    authConfig.jwtVerifySecret,
    { expiresIn: '1h' },
  );
}

export function createForgotPasswordToken(userId: string) {
  return jwt.sign(
    {
      sub: userId,
      typ: 'forgot-pass',
      jti: `forgot-${crypto.randomUUID()}`,
      iss: 'strong-together',
    },
    authConfig.jwtForgotPasswordSecret,
    { expiresIn: '5m' },
  );
}

export function createChangeEmailToken(userId: string, newEmail: string) {
  return jwt.sign(
    {
      sub: userId,
      typ: 'email-confirm',
      newEmail: newEmail.trim().toLowerCase(),
      jti: `email-change-${crypto.randomUUID()}`,
      iss: 'strong-together',
    },
    authConfig.changeEmailSecret,
    { expiresIn: '10m' },
  );
}

export function authHeaders(accessToken: string) {
  return {
    'x-app-version': '4.5.0',
    Authorization: `DPoP ${accessToken}`,
  };
}

export function refreshHeaders(refreshToken: string) {
  return {
    'x-app-version': '4.5.0',
    'x-refresh-token': `DPoP ${refreshToken}`,
  };
}

export function logoutHeaders(accessToken: string, refreshToken: string) {
  return {
    'x-app-version': '4.5.0',
    Authorization: `Bearer ${accessToken}`,
    'x-refresh-token': `Bearer ${refreshToken}`,
  };
}
