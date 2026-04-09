import jwt from 'jsonwebtoken';
import { authConfig } from '../../config/auth.config.ts';
import type { GenerateTicketResponse } from '@strong-together/shared';

export const generateTicketData = async (userId: string, username?: string): Promise<GenerateTicketResponse> => {
  const payload = {
    id: userId,
    username,
    jti: crypto.randomUUID(),
  };

  const ticket = jwt.sign(payload, authConfig.jwtSocketSecret, {
    expiresIn: '5400s',
    issuer: 'strong-together',
    audience: 'socket',
  });

  return { ticket };
};
