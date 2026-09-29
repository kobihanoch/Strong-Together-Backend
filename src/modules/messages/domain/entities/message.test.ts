import { describe, expect, it } from 'vitest';
import { Message } from './message';

const persisted = () => Message.restore({
  id: 'message-id', senderId: 'sender-id', receiverId: 'receiver-id', subject: 'Welcome', body: 'Hello',
  sentAt: new Date('2026-01-01T00:00:00Z'), isRead: false,
});

describe('Message', () => {
  it('creates unread state without persistence-generated values', () => {
    const message = Message.create({ senderId: 'sender-id', receiverId: 'receiver-id', subject: 'Welcome', body: 'Hello' });
    expect(message.id).toBeUndefined();
    expect(message.sentAt).toBeUndefined();
    expect(message.isRead).toBe(false);
  });

  it('allows only the receiver to mark it read', () => {
    const message = persisted();
    message.markAsRead('receiver-id');
    expect(message.isRead).toBe(true);
    expect(() => persisted().markAsRead('sender-id')).toThrow('Message not found');
  });

  it('is visible to its sender and receiver only', () => {
    expect(() => persisted().ensureVisibleTo('sender-id')).not.toThrow();
    expect(() => persisted().ensureVisibleTo('receiver-id')).not.toThrow();
    expect(() => persisted().ensureVisibleTo('other-id')).toThrow('Message not found');
  });
});
