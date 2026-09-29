import { Injectable } from '@nestjs/common';
import { CreateUserSql } from './writes/create-user.sql';
import { LinkByVerifiedEmailSql } from './writes/link-by-verified-email.sql';
import { FindLinkedUserSql } from './reads/find-linked-user.sql';
import { OAuthRepository } from '../../application/ports/oauth.repository';
import type { OAuthAccount } from '../../domain/entities/oauth-account';
import type { OAuthProviderIdentity } from '../../domain/value-objects/oauth-provider-identity';

/** PostgreSQL adapter for OAuth account lookup, linking, and creation. */
@Injectable()
export class PostgresOAuthRepository implements OAuthRepository {
  public constructor(
    private readonly findLinkedUserSql: FindLinkedUserSql,
    private readonly linkByVerifiedEmailSql: LinkByVerifiedEmailSql,
    private readonly createUserSql: CreateUserSql,
  ) {}

  findLinkedUser(identity: OAuthProviderIdentity): Promise<string | undefined> {
    return this.findLinkedUserSql.findLinkedUser(identity.provider, identity.providerUserId);
  }

  async linkByVerifiedEmail(account: OAuthAccount): Promise<OAuthAccount | undefined> {
    if (!account.verifiedEmail) return undefined;
    const userId = await this.linkByVerifiedEmailSql.linkByVerifiedEmail(account.identity.provider, account.verifiedEmail, account.identity.providerUserId);
    return userId ? account.linkToLocalUser(userId) : undefined;
  }

  async create(account: OAuthAccount): Promise<OAuthAccount> {
    const userId = await this.createUserSql.createUser(
      account.identity.provider,
      account.candidateUsername,
      account.email,
      account.fullName,
      account.identity.providerUserId,
      account.email,
    );
    return account.linkToLocalUser(userId);
  }
}
