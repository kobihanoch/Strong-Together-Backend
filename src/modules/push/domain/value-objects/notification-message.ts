/** Title and body displayed for a push notification. */
export class NotificationMessage {
  public readonly title: string;
  public readonly body: string;
  public constructor(title: string, body: string) {
    this.title = title;
    this.body = body;
  }
}
