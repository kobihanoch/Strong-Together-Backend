import { Command, type ICommand } from '@nestjs/cqrs';
import type { PushNotificationInput } from '../../models/push.models';
import type { SendPushNotificationResult } from '../../models/push.models';

export class SendPushNotificationCommand extends Command<SendPushNotificationResult> implements ICommand {
  public constructor(
    public readonly input: PushNotificationInput,
  ) {
    super();
  }
}
