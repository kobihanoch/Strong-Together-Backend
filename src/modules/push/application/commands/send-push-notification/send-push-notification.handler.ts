import { PushDeliveryTemporarilyUnavailableError } from '../../errors/push.errors';
import type { SendPushNotificationResult } from '../../models/push.models';
import { PushNotificationSender } from '../../ports/push-notification-sender.port';
import { PushNotification } from '../../../domain/entities/push-notification';
import { SendPushNotificationCommand } from './send-push-notification.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

/** Delivers one push notification and translates retryable provider outcomes. */
@CommandHandler(SendPushNotificationCommand)
export class SendPushNotificationHandler implements ICommandHandler<SendPushNotificationCommand> {
  public constructor(private readonly sender: PushNotificationSender) {}

  /**
   * Sends a notification through the configured provider.
   *
   * @param input - The destination token and notification content.
   * @returns A sent or permanent-failure result.
   * @throws {PushDeliveryTemporarilyUnavailableError} When delivery should be retried.
   */
  public async execute(command: SendPushNotificationCommand): Promise<SendPushNotificationResult> {
    const { input } = command;
    const outcome = await this.sender.send(PushNotification.create(input.token, input.title, input.body));
    if (outcome.kind === 'temporarily-unavailable') {
      throw new PushDeliveryTemporarilyUnavailableError(outcome.reason);
    }
    return outcome;
  }
}
