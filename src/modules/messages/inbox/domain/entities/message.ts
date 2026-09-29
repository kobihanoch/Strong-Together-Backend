import { MessageNotFoundError } from '../errors/message.errors';

export interface MessageValues { id: string; senderId: string; receiverId: string; isRead: boolean }

/** Inbox message state used by message commands. */
export class Message {
  private constructor(
    public readonly id: string,
    public readonly senderId: string,
    public readonly receiverId: string,
    public isRead: boolean,
  ) {}

  static restore(values: MessageValues): Message {
    return new Message(values.id, values.senderId, values.receiverId, values.isRead);
  }

  markAsRead(userId: string): void {
    if (this.receiverId !== userId) throw new MessageNotFoundError();
    this.isRead = true;
  }

  ensureVisibleTo(userId: string): void {
    if (this.senderId !== userId && this.receiverId !== userId) throw new MessageNotFoundError();
  }
}
