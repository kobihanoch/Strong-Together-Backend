import { Injectable } from '@nestjs/common';
import type { SocialUserProfile, SocialUserSearchItem } from '../application/models/social-users.models';
import { SocialUsersRepository } from '../application/ports/social-users.repository';
import { SocialUsersSql } from './social-users.sql';

/** PostgreSQL implementation of social-user discovery persistence. */
@Injectable()
export class PostgresSocialUsersRepository implements SocialUsersRepository {
  public constructor(private readonly sql: SocialUsersSql) {}

  public search(search: string, limit: number, cursor?: { timestamp: string; id: string }): Promise<SocialUserSearchItem[]> {
    return this.sql.search(search, limit, cursor);
  }

  public async findById(userId: string): Promise<SocialUserProfile | null> {
    return (await this.sql.findById(userId))[0] ?? null;
  }
}
