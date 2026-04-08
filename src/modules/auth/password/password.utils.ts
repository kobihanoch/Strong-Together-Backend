import jwt from 'jsonwebtoken';
import { ForgotPasswordPayload } from '../../../shared/types/dto/auth.dto.ts';
import { authConfig } from '../../../config/auth.config.ts';

export const decodeForgotPasswordToken = (forgotPasswordToken: string): ForgotPasswordPayload | null => {
  try {
    return jwt.verify(forgotPasswordToken, authConfig.jwtForgotPasswordSecret) as ForgotPasswordPayload;
  } catch {
    return null;
  }
};
