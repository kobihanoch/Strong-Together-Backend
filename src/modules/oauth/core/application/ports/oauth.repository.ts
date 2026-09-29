import type { OAuthAccount } from '../../domain/entities/oauth-account';
import type { OAuthProviderIdentity } from '../../domain/value-objects/oauth-provider-identity';

/** Persistence operations shared by OAuth providers. */
export abstract class OAuthRepository {
  abstract findLinkedUser(identity: OAuthProviderIdentity): Promise<string | undefined>;
  abstract linkByVerifiedEmail(account: OAuthAccount): Promise<OAuthAccount | undefined>;
  abstract create(account: OAuthAccount): Promise<OAuthAccount>;
}
