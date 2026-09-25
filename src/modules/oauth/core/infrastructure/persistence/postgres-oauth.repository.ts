import { Injectable } from '@nestjs/common';
import { CreateUserSql } from './writes/create-user.sql';
import { LinkByVerifiedEmailSql } from './writes/link-by-verified-email.sql';
import { FindLinkedUserSql } from './reads/find-linked-user.sql';
import type { OAuthProvider } from '../../application/models/oauth.models';
import { OAuthRepository } from '../../application/ports/oauth.repository';

/** PostgreSQL adapter for OAuth account lookup, linking, and creation. */
@Injectable()
export class PostgresOAuthRepository implements OAuthRepository {
  public constructor(
    private readonly findLinkedUserSql: FindLinkedUserSql,
    private readonly linkByVerifiedEmailSql: LinkByVerifiedEmailSql,
    private readonly createUserSql: CreateUserSql,
  ) {}

  findLinkedUser(provider: OAuthProvider, providerUserId: string): Promise<string | null> {
    return this.findLinkedUserSql.findLinkedUser(provider, providerUserId);
  }

  linkByVerifiedEmail(provider: OAuthProvider, email: string, providerUserId: string): Promise<string | null> {
    return this.linkByVerifiedEmailSql.linkByVerifiedEmail(provider, email, providerUserId);
  }

  createUser(
    provider: OAuthProvider,
    candidateUsername: string | null,
    email: string | null,
    fullName: string,
    providerUserId: string,
    providerEmail: string | null,
  ): Promise<string> {
    return this.createUserSql.createUser(provider, candidateUsername, email, fullName, providerUserId, providerEmail);
  }
}
