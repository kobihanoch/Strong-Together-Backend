import { describe, expect, it } from 'vitest';
import { UnverifiedEmailChange } from './unverified-email-change';

describe('UnverifiedEmailChange', () => {
  it('normalizes valid account and email values', () => {
    const change = UnverifiedEmailChange.create(' runner ', 'secret', 'New@Example.com');
    expect(change.username).toBe('runner');
    expect(change.newEmail.value).toBe('New@Example.com');
  });

  it('rejects invalid account values', () => {
    expect(() => UnverifiedEmailChange.create('x', 'secret', 'new@example.com')).toThrow('Invalid username');
    expect(() => UnverifiedEmailChange.create('runner', '', 'new@example.com')).toThrow('Invalid password');
    expect(() => UnverifiedEmailChange.create('runner', 'secret', 'invalid')).toThrow('Invalid email');
  });
});
