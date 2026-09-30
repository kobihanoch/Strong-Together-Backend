import { Command, type ICommand } from '@nestjs/cqrs';
import type { DeliveredMessage } from '../../models/system-messages.models';

export class SendWorkoutCompleteSystemMessageCommand extends Command<DeliveredMessage> implements ICommand {
  public constructor(
    public readonly receiverId: string,
  ) {
    super();
  }
}
