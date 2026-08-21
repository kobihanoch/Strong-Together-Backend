import jwt from 'jsonwebtoken';
import type { ForgotPasswordPayloadDto } from '@strong-together/shared';
import { authConfig } from '../../../config/auth.config';

export const decodeForgotPasswordToken = (forgotPasswordToken: string): ForgotPasswordPayloadDto | null => {
  try {
    return jwt.verify(forgotPasswordToken, authConfig.jwtForgotPasswordSecret) as ForgotPasswordPayloadDto;
  } catch {
    return null;
  }
};
