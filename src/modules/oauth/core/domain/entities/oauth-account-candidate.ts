import { OAuthProviderIdentity } from '../value-objects/oauth-provider-identity';

/** Provider-backed account values ready for OAuth user creation. */
export class OAuthAccountCandidate {
  public readonly identity: OAuthProviderIdentity;
  public readonly candidateUsername: string | null;
  public readonly email: string | null;
  public readonly fullName: string;
  public readonly providerEmail: string | null;

  public constructor(
    identity: OAuthProviderIdentity,
    candidateUsername: string | null,
    email: string | null,
    fullName: string,
    providerEmail: string | null,
  ) {
    this.identity = identity;
    this.candidateUsername = candidateUsername;
    this.email = email;
    this.fullName = fullName;
    this.providerEmail = providerEmail;
  }
}
