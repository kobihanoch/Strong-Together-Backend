import jwt from 'jsonwebtoken';
import { authConfig } from '../../../config/auth.config';

export const decodeChangeEmailToken = (changeEmailToken: string): any | null => {
  try {
    return jwt.verify(changeEmailToken, authConfig.changeEmailSecret) as any;
  } catch {
    return null;
  }
};
