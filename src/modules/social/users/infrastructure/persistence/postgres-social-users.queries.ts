import { Injectable } from '@nestjs/common';
import { FindByIdSql } from './reads/find-by-id.sql';
import { SearchSql } from './reads/search.sql';
import type { SocialUserProfile, SocialUserSearchItem } from '../../application/models/social-users.models';
import { SocialUsersQueries } from '../../application/ports/social-users.queries';

/** PostgreSQL implementation of social-user discovery persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresSocialUsersQueries implements SocialUsersQueries {
  public constructor(
    private readonly searchSql: SearchSql,
    private readonly findByIdSql: FindByIdSql,
  ) {}
  public search(search: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<SocialUserSearchItem[]> {
    return this.searchSql.search(search, limit, cursor);
  }
  public async findById(userId: string): Promise<SocialUserProfile | null> {
    return (await this.findByIdSql.findById(userId))[0] ?? null;
  }
}
