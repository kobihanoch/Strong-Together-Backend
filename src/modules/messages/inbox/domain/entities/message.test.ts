import { describe, expect, it } from 'vitest';
import { Message } from './message';

const message = () => Message.restore({ id: 'message-id', senderId: 'sender-id', receiverId: 'receiver-id', isRead: false });

describe('Message', () => {
  it('allows the receiver to mark it read', () => { const current = message(); current.markAsRead('receiver-id'); expect(current.isRead).toBe(true); });
  it('hides receiver-only behavior from other users', () => expect(() => message().markAsRead('sender-id')).toThrow('Message not found'));
  it('is visible to its sender and receiver only', () => {
    expect(() => message().ensureVisibleTo('sender-id')).not.toThrow();
    expect(() => message().ensureVisibleTo('receiver-id')).not.toThrow();
    expect(() => message().ensureVisibleTo('other-id')).toThrow('Message not found');
  });
});
