import { Inject, Injectable } from '@nestjs/common';
import { UserByIndetifier } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class VerificationQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryUserByUsername(username: string): Promise<UserByIndetifier[]> {
    const [row] = await this.sql<{ user_data: UserByIndetifier | null }[]>`
      SELECT guest_api.find_user_by_username(${username}) AS user_data
    `;
    return row?.user_data ? [row.user_data] : [];
  }

  async queryUpdateUserVerficiationStatus(userId: string, state: boolean): Promise<void> {
    await this.sql`UPDATE identity.user AS users SET is_verified = ${state} WHERE users.id = ${userId}::uuid`;
  }
}
