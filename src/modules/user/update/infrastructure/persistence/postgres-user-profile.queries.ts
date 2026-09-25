import { Injectable } from '@nestjs/common';
import { FindSql } from './reads/find.sql';
import type { UserProfile } from '../../application/models/update-user.models';
import { UserProfileQueries } from '../../application/ports/user-profile.queries';

/** PostgreSQL adapter for user profile persistence. */

/** PostgreSQL read adapter. */
@Injectable()
export class PostgresUserProfileQueries implements UserProfileQueries {
  public constructor(private readonly findSql: FindSql) {}
  async find(userId: string): Promise<UserProfile | null> {
    return (await this.findSql.find(userId))[0]?.userData ?? null;
  }
}
