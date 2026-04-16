import { authConfig } from '../../config/auth.config.ts';
import jwt from 'jsonwebtoken';

export const decodeSocketToken = (ticket: string): any | null => {
  try {
    return jwt.verify(ticket, authConfig.jwtSocketSecret, {
      issuer: 'strong-together',
      audience: 'socket',
    }) as any;
  } catch {
    return null;
  }
};
