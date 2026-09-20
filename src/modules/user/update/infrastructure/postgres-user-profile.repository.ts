import { Injectable } from '@nestjs/common';
import type { UpdateUserInput, UserProfile } from '../application/models/update-user.models';
import { UserProfileRepository } from '../application/ports/user-profile.repository';
import { UpdateUserSql } from './update-user.sql';

/** PostgreSQL adapter for user profile persistence. */
@Injectable()
export class PostgresUserProfileRepository implements UserProfileRepository {
  constructor(private readonly sql: UpdateUserSql) {}
  async find(userId: string): Promise<UserProfile | null> {
    return (await this.sql.find(userId))[0]?.userData ?? null;
  }
  async update(userId: string, input: UpdateUserInput): Promise<UserProfile | null> {
    return (await this.sql.update(userId, input))[0]?.userData ?? null;
  }
  updateEmail(userId: string, email: string): Promise<void> {
    return this.sql.updateEmail(userId, email);
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
