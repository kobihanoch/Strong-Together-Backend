import { Injectable } from '@nestjs/common';
import type { OAuthProvider } from '../application/models/oauth.models';
import { OAuthRepository } from '../application/ports/oauth.repository';
import { OAuthSql } from './oauth.sql';

/** PostgreSQL adapter for OAuth account lookup, linking, and creation. */
@Injectable()
export class PostgresOAuthRepository implements OAuthRepository {
  constructor(private readonly sql: OAuthSql) {}

  findLinkedUser(provider: OAuthProvider, providerUserId: string): Promise<string | null> {
    return this.sql.findLinkedUser(provider, providerUserId);
  }

  linkByVerifiedEmail(provider: OAuthProvider, email: string, providerUserId: string): Promise<string | null> {
    return this.sql.linkByVerifiedEmail(provider, email, providerUserId);
  }

  createUser(
    provider: OAuthProvider,
    candidateUsername: string | null,
    email: string | null,
    fullName: string,
    providerUserId: string,
    providerEmail: string | null,
  ): Promise<string> {
    return this.sql.createUser(provider, candidateUsername, email, fullName, providerUserId, providerEmail);
  }
}
