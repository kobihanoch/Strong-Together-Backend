/** OAuth providers supported by the identity domain. */
export type SupportedOAuthProvider = 'apple' | 'google';

/** Stable external identity belonging to a supported OAuth provider. */
export class OAuthProviderIdentity {
  public readonly provider: SupportedOAuthProvider;
  public readonly providerUserId: string;
  public constructor(provider: SupportedOAuthProvider, providerUserId: string) {
    if (provider !== 'apple' && provider !== 'google') throw new UnsupportedOAuthProviderError();
    if (providerUserId.length === 0) throw new OAuthProviderUserIdRequiredError();
    this.provider = provider;
    this.providerUserId = providerUserId;
  }
}
import { OAuthProviderUserIdRequiredError, UnsupportedOAuthProviderError } from '../errors/oauth-account.errors';
