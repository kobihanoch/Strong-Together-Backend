import type { LinkOAuthAccountOutcome, OAuthProvider } from '../models/oauth.models';

/** Persistence operations shared by OAuth providers. */
export abstract class OAuthRepository {
  abstract findLinkedUser(provider: OAuthProvider, providerUserId: string): Promise<string | null>;
  abstract linkByVerifiedEmail(provider: OAuthProvider, email: string, providerUserId: string): Promise<LinkOAuthAccountOutcome>;
  abstract createUser(
    provider: OAuthProvider,
    candidateUsername: string | null,
    email: string | null,
    fullName: string,
    providerUserId: string,
    providerEmail: string | null,
  ): Promise<string>;
}
