import { NotificationMessage } from '../value-objects/notification-message';

/** Push notification prepared for provider delivery. */
export class PushNotification {
  public readonly token: string;
  public readonly message: NotificationMessage;
  private constructor(token: string, title: string, body: string) {
    this.token = token;
    this.message = new NotificationMessage(title, body);
  }

  static create(token: string, title: string, body: string): PushNotification {
    return new PushNotification(token, title, body);
  }
}
