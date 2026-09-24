import { Injectable } from '@nestjs/common';
import { PushDeliveryTemporarilyUnavailableError } from '../errors/push.errors';
import type { PushNotificationInput, SendPushNotificationResult } from '../models/push.models';
import { PushNotificationSender } from '../ports/push-notification-sender.port';

/** Delivers one push notification and translates retryable provider outcomes. */
@Injectable()
export class SendPushNotificationUseCase {
  public constructor(private readonly sender: PushNotificationSender) {}

  /**
   * Sends a notification through the configured provider.
   *
   * @param input - The destination token and notification content.
   * @returns A sent or permanent-failure result.
   * @throws {PushDeliveryTemporarilyUnavailableError} When delivery should be retried.
   */
  public async execute(input: PushNotificationInput): Promise<SendPushNotificationResult> {
    const outcome = await this.sender.send(input);
    if (outcome.kind === 'temporarily-unavailable') {
      throw new PushDeliveryTemporarilyUnavailableError(outcome.reason);
    }
    return outcome;
  }
}
