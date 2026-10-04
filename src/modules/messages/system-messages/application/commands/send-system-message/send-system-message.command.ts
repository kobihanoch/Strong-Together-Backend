import { Command, type ICommand } from '@nestjs/cqrs';

import type { DeliveredMessage } from '../../models/system-messages.models';
export class SendSystemMessageCommand extends Command<DeliveredMessage> implements ICommand {
  public constructor(
    public readonly receiverId: string,
    public readonly message: {
    header: string;
    text: string;
},
  ) {
    super();
  }
}
