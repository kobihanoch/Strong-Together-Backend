import jwt from 'jsonwebtoken';
import type { GenerateTicketResponse } from '../../types/api/webSockets/responses.ts';

export const generateTicketData = async (
  userId: string,
  username?: string,
): Promise<GenerateTicketResponse> => {
  const payload = {
    id: userId,
    username,
    jti: crypto.randomUUID(),
  };

  const ticket = jwt.sign(payload, process.env.JWT_SOCKET_SECRET || '', {
    expiresIn: '5400s',
    issuer: 'strong-together',
    audience: 'socket',
  });

  return { ticket };
};
