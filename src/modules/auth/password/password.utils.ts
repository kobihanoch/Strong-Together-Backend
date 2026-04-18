import jwt from 'jsonwebtoken';
import type { ForgotPasswordPayload } from '@strong-together/shared';
import { authConfig } from '../../../config/auth.config';

export const decodeForgotPasswordToken = (forgotPasswordToken: string): ForgotPasswordPayload | null => {
  try {
    return jwt.verify(forgotPasswordToken, authConfig.jwtForgotPasswordSecret) as ForgotPasswordPayload;
  } catch {
    return null;
  }
};
