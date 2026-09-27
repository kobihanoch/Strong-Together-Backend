import { describe, expect, it } from 'vitest';
import { UnverifiedEmailChange } from './unverified-email-change';

describe('UnverifiedEmailChange', () => {
  it('normalizes valid account and email values', () => {
    const change = new UnverifiedEmailChange(' runner ', 'secret', 'New@Example.com');
    expect(change.username).toBe('runner');
    expect(change.newEmail.value).toBe('New@Example.com');
  });

  it('rejects invalid account values', () => {
    expect(() => new UnverifiedEmailChange('x', 'secret', 'new@example.com')).toThrow('Invalid username');
    expect(() => new UnverifiedEmailChange('runner', '', 'new@example.com')).toThrow('Invalid password');
    expect(() => new UnverifiedEmailChange('runner', 'secret', 'invalid')).toThrow('Invalid email');
  });
});
