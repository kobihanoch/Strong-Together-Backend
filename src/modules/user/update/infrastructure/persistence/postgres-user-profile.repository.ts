import { Injectable } from '@nestjs/common';
import { UpdateProfilePictureSql } from './writes/update-profile-picture.sql';
import { FindProfilePictureSql } from './reads/find-profile-picture.sql';
import { DeleteSql } from './writes/delete.sql';
import { UpdateEmailSql } from './writes/update-email.sql';
import { UpdateSql } from './writes/update.sql';
import { FindSql } from './reads/find.sql';
import postgres from 'postgres';
import type { UpdateUserEmailOutcome, UpdateUserInput, UpdateUserProfileOutcome, UserProfile } from '../../application/models/update-user.models';
import { UserProfileRepository } from '../../application/ports/user-profile.repository';

/** PostgreSQL adapter for user profile persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresUserProfileRepository implements UserProfileRepository {
  public constructor(
    private readonly findSql: FindSql,
    private readonly updateSql: UpdateSql,
    private readonly updateEmailSql: UpdateEmailSql,
    private readonly deleteSql: DeleteSql,
    private readonly findProfilePictureSql: FindProfilePictureSql,
    private readonly updateProfilePictureSql: UpdateProfilePictureSql,
  ) {}
  async find(userId: string): Promise<UserProfile | null> {
    return (await this.findSql.find(userId))[0]?.userData ?? null;
  }
  async update(userId: string, input: UpdateUserInput): Promise<UpdateUserProfileOutcome> {
    try {
      return await this.updateSql.update(userId, input);
    } catch (error) {
      if (error instanceof postgres.PostgresError && error.code === '23505') return { kind: 'conflict' };
      throw error;
    }
  }
  async updateEmail(userId: string, email: string): Promise<UpdateUserEmailOutcome> {
    try {
      await this.updateEmailSql.updateEmail(userId, email);
      return { kind: 'updated' };
    } catch (error) {
      if (error instanceof postgres.PostgresError && error.code === '23505') return { kind: 'conflict' };
      throw error;
    }
  }
  delete(userId: string): Promise<void> {
    return this.deleteSql.delete(userId);
  }
  async findProfilePicture(userId: string): Promise<string | null> {
    return (await this.findProfilePictureSql.findProfilePicture(userId))[0]?.profilePicPath ?? null;
  }
  updateProfilePicture(userId: string, path: string | null): Promise<void> {
    return this.updateProfilePictureSql.updateProfilePicture(userId, path);
  }
}
