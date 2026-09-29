import { MessageNotFoundError } from '../errors/message.errors';

export interface MessageCreationValues { senderId: string; receiverId: string; subject: string; body: string }
export interface MessagePersistenceValues extends MessageCreationValues { id: string; sentAt: Date; isRead: boolean }

/** A message exchanged between two users, including system-originated messages. */
export class Message {
  private constructor(
    public readonly id: string | undefined,
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly subject: string,
    public readonly body: string,
    public readonly sentAt: Date | undefined,
    public isRead: boolean,
  ) {}

  static create(values: MessageCreationValues): Message {
    return new Message(undefined, values.senderId, values.receiverId, values.subject, values.body, undefined, false);
  }

  static restore(values: MessagePersistenceValues): Message {
    return new Message(values.id, values.senderId, values.receiverId, values.subject, values.body, values.sentAt, values.isRead);
  }

  markAsRead(userId: string): void {
    if (this.receiverId !== userId) throw new MessageNotFoundError();
    this.isRead = true;
  }

  ensureVisibleTo(userId: string): void {
    if (this.senderId !== userId && this.receiverId !== userId) throw new MessageNotFoundError();
  }
}
