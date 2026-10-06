import { describe, expect, it } from 'vitest';
import { DevicePushToken } from './device-push-token';

describe('DevicePushToken', () => {
  it('normalizes a valid token', () => expect(new DevicePushToken(' token ').value).toBe('token'));
  it('rejects empty and oversized tokens', () => {
    expect(() => new DevicePushToken(' ')).toThrow('Push token is required');
    expect(() => new DevicePushToken('a'.repeat(4_097))).toThrow('Push token must be at most 4096 characters');
  });
});
