import { describe, expect, it } from 'vitest';
import { OAuthAccountCandidate } from './oauth-account-candidate';
import { OAuthAccountLink } from './oauth-account-link';
import { OAuthProviderIdentity } from '../value-objects/oauth-provider-identity';

describe('OAuth account domain', () => {
  it('carries a verified provider identity through linking and creation', () => {
    const identity = new OAuthProviderIdentity('google', 'provider-user');
    expect(new OAuthAccountLink(identity, 'user@example.com').identity).toBe(identity);
    expect(new OAuthAccountCandidate(identity, 'user', 'user@example.com', 'User', 'user@example.com').identity).toBe(identity);
  });

  it('rejects an empty provider user identity', () => {
    expect(() => new OAuthProviderIdentity('apple', '')).toThrow('OAuth provider user ID is required');
  });
});
