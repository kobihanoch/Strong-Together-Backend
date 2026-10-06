import { Command, type ICommand } from '@nestjs/cqrs';
import type { DeliveredMessage } from '../../models/system-messages.models';

export class SendWelcomeSystemMessageCommand extends Command<DeliveredMessage> implements ICommand {
  public constructor(
    public readonly receiverId: string,
    public readonly receiverName: string,
  ) {
    super();
  }
}
