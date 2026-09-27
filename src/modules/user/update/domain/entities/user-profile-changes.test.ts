import { describe, expect, it } from 'vitest';
import { UserProfileChanges } from './user-profile-changes';

describe('UserProfileChanges', () => {
  it('normalizes provided profile fields', () => {
    const changes = new UserProfileChanges({ username: ' runner ', fullName: ' Jane Doe ', email: 'JANE@EXAMPLE.COM' });
    expect(changes.username).toBe('runner');
    expect(changes.fullName).toBe('Jane Doe');
    expect(changes.email?.value).toBe('jane@example.com');
  });

  it('requires at least one valid change', () => {
    expect(() => new UserProfileChanges({})).toThrow('At least one profile field must be provided');
    expect(() => new UserProfileChanges({ username: 'x' })).toThrow('Invalid username');
  });
});
