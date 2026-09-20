import { Injectable } from '@nestjs/common';
import type { WebSocketTicketResult } from '../models/web-socket-ticket.models';
import { WebSocketTicketIssuer } from '../ports/web-socket-ticket-issuer.port';

/** Creates authenticated WebSocket connection tickets. */
@Injectable()
export class CreateWebSocketTicketUseCase {
  constructor(private readonly ticketIssuer: WebSocketTicketIssuer) {}

  /**
   * Issues a short-lived ticket for a user.
   * @param userId - The authenticated user identifier.
   * @param username - The optional username embedded in the ticket.
   * @returns The signed connection ticket.
   */
  execute(userId: string, username?: string): WebSocketTicketResult {
    return { ticket: this.ticketIssuer.issue(userId, username) };
  }
}
