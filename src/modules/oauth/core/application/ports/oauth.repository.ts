import type { OAuthAccountCandidate } from '../../domain/entities/oauth-account-candidate';
import type { OAuthAccountLink } from '../../domain/entities/oauth-account-link';
import type { OAuthProviderIdentity } from '../../domain/value-objects/oauth-provider-identity';
import type { LinkOAuthAccountOutcome } from '../models/oauth.models';

/** Persistence operations shared by OAuth providers. */
export abstract class OAuthRepository {
  abstract findLinkedUser(identity: OAuthProviderIdentity): Promise<string | null>;
  abstract linkByVerifiedEmail(link: OAuthAccountLink): Promise<LinkOAuthAccountOutcome>;
  abstract createUser(candidate: OAuthAccountCandidate): Promise<string>;
}
