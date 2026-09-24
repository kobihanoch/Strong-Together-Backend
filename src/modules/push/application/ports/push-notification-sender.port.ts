import type { PushNotificationInput, SendPushNotificationOutcome } from '../models/push.models';

/** Delivers individual push notifications through an external provider. */
export abstract class PushNotificationSender {
  public abstract send(input: PushNotificationInput): Promise<SendPushNotificationOutcome>;
}
