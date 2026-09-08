import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../config/auth.config';
import type { CreateWebSocketTicketResponse } from '@strong-together/shared';

@Injectable()
export class WebSocketsService {
  /**
   * Generates ticket.
   * @param userId - The user identifier.
   * @param username - The username.
   * @returns The generate ticket result.
   */
  async createWebSocketTicketData(userId: string, username?: string): Promise<CreateWebSocketTicketResponse> {
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
