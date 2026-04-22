import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../config/auth.config';
import type { GenerateTicketResponse } from '@strong-together/shared';

@Injectable()
export class WebSocketsService {
  async generateTicketData(userId: string, username?: string): Promise<GenerateTicketResponse> {
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
  }
}
