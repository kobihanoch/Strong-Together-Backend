/** OAuth providers supported by the identity domain. */
export type SupportedOAuthProvider = 'apple' | 'google';

/** Stable external identity belonging to a supported OAuth provider. */
export class OAuthProviderIdentity {
  public readonly provider: SupportedOAuthProvider;
  public readonly providerUserId: string;
  public constructor(provider: SupportedOAuthProvider, providerUserId: string) {
    if (provider !== 'apple' && provider !== 'google') throw new Error('OAuth provider is not supported');
    if (providerUserId.length === 0) throw new Error('OAuth provider user ID is required');
    this.provider = provider;
    this.providerUserId = providerUserId;
  }
}
