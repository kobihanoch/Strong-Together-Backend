import { describe, expect, it } from 'vitest';
import { UserProfile } from './user-profile';

const restoreProfile = () => UserProfile.restore({ id: 'user-id', username: 'old', fullName: 'Old Name', email: 'old@example.com', profilePicturePath: null });

describe('UserProfile', () => {
  it('normalizes provided profile fields', () => {
    const profile = restoreProfile();
    profile.changeDetails({ username: ' runner ', fullName: ' Jane Doe ', email: 'JANE@EXAMPLE.COM' });
    expect(profile.username).toBe('runner');
    expect(profile.fullName).toBe('Jane Doe');
    expect(profile.pendingEmail?.value).toBe('jane@example.com');
  });

  it('requires at least one valid change', () => {
    expect(() => restoreProfile().changeDetails({})).toThrow('At least one profile field must be provided');
    expect(() => restoreProfile().changeDetails({ username: 'x' })).toThrow('Invalid username');
  });

  it('does not request confirmation when the normalized email is unchanged', () => {
    const profile = restoreProfile();
    profile.changeDetails({ email: ' OLD@EXAMPLE.COM ' });
    expect(profile.pendingEmail).toBeUndefined();
  });
});
