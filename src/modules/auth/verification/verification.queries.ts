import { Inject, Injectable } from '@nestjs/common';
import { UserByIndetifier } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class VerificationQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryUserByUsername(username: string): Promise<UserByIndetifier[]> {
    return this.sql<UserByIndetifier[]>`
      SELECT id, name, username, password, role, is_first_login, is_verified
      FROM identity.users
      WHERE username=${username} 
      LIMIT 1
    `;
  }

  async queryUpdateUserVerficiationStatus(userId: string, state: boolean): Promise<void> {
    await this.sql`UPDATE identity.users SET is_verified = ${state} WHERE users.id = ${userId}::uuid`;
  }
}
