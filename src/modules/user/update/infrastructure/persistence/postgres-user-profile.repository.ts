import { Injectable } from '@nestjs/common';
import { UpdateProfilePictureSql } from './writes/update-profile-picture.sql';
import { FindProfilePictureSql } from './reads/find-profile-picture.sql';
import { DeleteSql } from './writes/delete.sql';
import { UpdateEmailSql } from './writes/update-email.sql';
import { SaveSql } from './writes/save.sql';
import { FindByIdForUpdateSql } from './reads/find-by-id-for-update.sql';
import postgres from 'postgres';
import type { UpdateUserEmailOutcome } from '../../application/models/update-user.models';
import { UserProfileRepository } from '../../application/ports/user-profile.repository';
import { UserProfile } from '../../domain/entities/user-profile';
import type { ProfileEmail } from '../../domain/value-objects/profile-email';
import { UserProfileIdentityConflictError } from '../../domain/errors/user-profile.errors';

/** PostgreSQL adapter for user profile persistence. */

/** PostgreSQL write adapter. */
@Injectable()
export class PostgresUserProfileRepository implements UserProfileRepository {
  public constructor(
    private readonly findByIdForUpdateSql: FindByIdForUpdateSql,
    private readonly saveSql: SaveSql,
    private readonly updateEmailSql: UpdateEmailSql,
    private readonly deleteSql: DeleteSql,
    private readonly findProfilePictureSql: FindProfilePictureSql,
    private readonly updateProfilePictureSql: UpdateProfilePictureSql,
  ) {}
  async findByIdForUpdate(userId: string): Promise<UserProfile | undefined> {
    const row = await this.findByIdForUpdateSql.findByIdForUpdate(userId);
    return row ? UserProfile.restore({ id: row.id, username: row.username, fullName: row.name, email: row.email, profilePicturePath: row.profilePicturePath }) : undefined;
  }
  async save(profile: UserProfile): Promise<void> {
    try {
      await this.saveSql.save(profile.id, {
        username: profile.username,
        fullName: profile.fullName,
        ...(profile.pendingEmail ? { pendingEmail: profile.pendingEmail.value } : {}),
      });
    } catch (error) {
      if (error instanceof postgres.PostgresError && error.code === '23505') throw new UserProfileIdentityConflictError();
      throw error;
    }
  }
  async updateEmail(userId: string, email: ProfileEmail): Promise<UpdateUserEmailOutcome> {
    try {
      await this.updateEmailSql.updateEmail(userId, email.value);
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
