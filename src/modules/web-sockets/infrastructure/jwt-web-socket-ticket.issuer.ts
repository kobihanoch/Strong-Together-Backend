import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { authConfig } from '../../../config/auth.config';
import { WebSocketTicketIssuer } from '../application/ports/web-socket-ticket-issuer.port';

/** JWT-backed WebSocket ticket issuer. */
@Injectable()
export class JwtWebSocketTicketIssuer implements WebSocketTicketIssuer {
  issue(userId: string, username?: string): string {
    return jwt.sign({ id: userId, username, jti: crypto.randomUUID() }, authConfig.jwtSocketSecret, {
      expiresIn: '5400s',
      issuer: 'strong-together',
      audience: 'socket',
    });
  }
}
