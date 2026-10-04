import { Command, type ICommand } from '@nestjs/cqrs';

import type { WebSocketTicketResult } from '../../models/web-socket-ticket.models';
export class CreateWebSocketTicketCommand extends Command<WebSocketTicketResult> implements ICommand {
  public constructor(
    public readonly userId: string,
    public readonly username?: string,
  ) {
    super();
  }
}
