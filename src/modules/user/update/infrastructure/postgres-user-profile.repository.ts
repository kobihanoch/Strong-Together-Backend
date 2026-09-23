import { Injectable } from '@nestjs/common';
import postgres from 'postgres';
import type {
  UpdateUserEmailOutcome,
  UpdateUserInput,
  UpdateUserProfileOutcome,
  UserProfile,
} from '../application/models/update-user.models';
import { UserProfileRepository } from '../application/ports/user-profile.repository';
import { UpdateUserSql } from './update-user.sql';

/** PostgreSQL adapter for user profile persistence. */
@Injectable()
export class PostgresUserProfileRepository implements UserProfileRepository {
  constructor(private readonly sql: UpdateUserSql) {}
  async find(userId: string): Promise<UserProfile | null> {
    return (await this.sql.find(userId))[0]?.userData ?? null;
  }
  async update(userId: string, input: UpdateUserInput): Promise<UpdateUserProfileOutcome> {
    try {
      const profile = (await this.sql.update(userId, input))[0]?.userData;
      return profile ? { kind: 'updated', profile } : { kind: 'not-found' };
    } catch (error) {
      if (error instanceof postgres.PostgresError && error.code === '23505') return { kind: 'conflict' };
      throw error;
    }
  }
  async updateEmail(userId: string, email: string): Promise<UpdateUserEmailOutcome> {
    try {
      await this.sql.updateEmail(userId, email);
      return { kind: 'updated' };
    } catch (error) {
      if (error instanceof postgres.PostgresError && error.code === '23505') return { kind: 'conflict' };
      throw error;
    }
  }
  delete(userId: string): Promise<void> {
    return this.sql.delete(userId);
  }
  async findProfilePicture(userId: string): Promise<string | null> {
    return (await this.sql.profilePicture(userId))[0]?.profilePicPath ?? null;
  }
  updateProfilePicture(userId: string, path: string | null): Promise<void> {
    return this.sql.updateProfilePicture(userId, path);
  }
}
