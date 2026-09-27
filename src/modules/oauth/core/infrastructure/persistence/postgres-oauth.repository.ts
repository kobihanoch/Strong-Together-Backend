import { Injectable } from '@nestjs/common';
import { CreateUserSql } from './writes/create-user.sql';
import { LinkByVerifiedEmailSql } from './writes/link-by-verified-email.sql';
import { FindLinkedUserSql } from './reads/find-linked-user.sql';
import type { LinkOAuthAccountOutcome } from '../../application/models/oauth.models';
import { OAuthRepository } from '../../application/ports/oauth.repository';
import type { OAuthAccountCandidate } from '../../domain/entities/oauth-account-candidate';
import type { OAuthAccountLink } from '../../domain/entities/oauth-account-link';
import type { OAuthProviderIdentity } from '../../domain/value-objects/oauth-provider-identity';

/** PostgreSQL adapter for OAuth account lookup, linking, and creation. */
@Injectable()
export class PostgresOAuthRepository implements OAuthRepository {
  public constructor(
    private readonly findLinkedUserSql: FindLinkedUserSql,
    private readonly linkByVerifiedEmailSql: LinkByVerifiedEmailSql,
    private readonly createUserSql: CreateUserSql,
  ) {}

  findLinkedUser(identity: OAuthProviderIdentity): Promise<string | null> {
    return this.findLinkedUserSql.findLinkedUser(identity.provider, identity.providerUserId);
  }

  linkByVerifiedEmail(link: OAuthAccountLink): Promise<LinkOAuthAccountOutcome> {
    return this.linkByVerifiedEmailSql.linkByVerifiedEmail(link.identity.provider, link.email, link.identity.providerUserId);
  }

  createUser(candidate: OAuthAccountCandidate): Promise<string> {
    return this.createUserSql.createUser(
      candidate.identity.provider,
      candidate.candidateUsername,
      candidate.email,
      candidate.fullName,
      candidate.identity.providerUserId,
      candidate.providerEmail,
    );
  }
}
