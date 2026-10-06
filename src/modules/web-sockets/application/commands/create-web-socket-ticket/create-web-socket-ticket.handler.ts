import type { WebSocketTicketResult } from '../../models/web-socket-ticket.models';
import { WebSocketTicketIssuer } from '../../ports/web-socket-ticket-issuer.port';
import { CreateWebSocketTicketCommand } from './create-web-socket-ticket.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Creates authenticated WebSocket connection tickets. */
@CommandHandler(CreateWebSocketTicketCommand)
export class CreateWebSocketTicketHandler implements ICommandHandler<CreateWebSocketTicketCommand> {
  constructor(private readonly ticketIssuer: WebSocketTicketIssuer) {}

  /**
   * Issues a short-lived ticket for a user.
   *
   * @param userId - The authenticated user identifier.
   * @param username - The optional username embedded in the ticket.
   * @returns The signed connection ticket.
   */
  async execute(command: CreateWebSocketTicketCommand): Promise<WebSocketTicketResult> {
    const { userId, username } = command;
    return { ticket: this.ticketIssuer.issue(userId, username) };
  }
}
