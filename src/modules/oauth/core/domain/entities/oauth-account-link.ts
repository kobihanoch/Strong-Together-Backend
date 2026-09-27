import { OAuthProviderIdentity } from '../value-objects/oauth-provider-identity';

/** Verified provider identity and email proposed for account linking. */
export class OAuthAccountLink {
  public readonly identity: OAuthProviderIdentity;
  public readonly email: string;
  public constructor(identity: OAuthProviderIdentity, email: string) {
    this.identity = identity;
    this.email = email;
  }
}
