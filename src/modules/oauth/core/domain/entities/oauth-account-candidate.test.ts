import { describe, expect, it } from 'vitest';
import { OAuthAccount } from './oauth-account';
import { OAuthProviderIdentity } from '../value-objects/oauth-provider-identity';

describe('OAuth account domain', () => {
  it('carries one verified provider identity through linking and creation', () => {
    const account = OAuthAccount.create({ provider: 'google', providerUserId: 'provider-user', email: 'User@Example.com', emailVerified: true, fullName: 'User' });
    expect(account.identity.providerUserId).toBe('provider-user');
    expect(account.verifiedEmail).toBe('User@Example.com');
    expect(account.candidateUsername).toBe('user');
  });

  it('rejects an empty provider user identity', () => {
    expect(() => new OAuthProviderIdentity('apple', '')).toThrow('OAuth provider user ID is required');
  });
});
