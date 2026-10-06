import type { PushNotification } from '../../domain/entities/push-notification';
import type { SendPushNotificationOutcome } from '../models/push.models';

/** Delivers individual push notifications through an external provider. */
export abstract class PushNotificationSender {
  public abstract send(notification: PushNotification): Promise<SendPushNotificationOutcome>;
}
