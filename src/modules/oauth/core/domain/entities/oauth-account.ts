import { OAuthProviderIdentity, type SupportedOAuthProvider } from '../value-objects/oauth-provider-identity';

export interface OAuthAccountValues {
  provider: SupportedOAuthProvider;
  providerUserId: string;
  email: string | null;
  emailVerified: boolean;
  fullName: string;
}

/** Provider identity and profile data used to resolve a local OAuth account. */
export class OAuthAccount {
  private constructor(
    public readonly localUserId: string | undefined,
    public readonly identity: OAuthProviderIdentity,
    public readonly email: string | null,
    public readonly emailVerified: boolean,
    public readonly fullName: string,
  ) {}

  static create(values: OAuthAccountValues): OAuthAccount {
    return new OAuthAccount(undefined, new OAuthProviderIdentity(values.provider, values.providerUserId), values.email, values.emailVerified, values.fullName);
  }

  linkToLocalUser(userId: string): OAuthAccount {
    return new OAuthAccount(userId, this.identity, this.email, this.emailVerified, this.fullName);
  }

  get verifiedEmail(): string | undefined { return this.emailVerified && this.email ? this.email : undefined; }
  get candidateUsername(): string | null { return this.email?.split('@')[0].toLowerCase() ?? null; }
}
