import { Inject, Injectable } from '@nestjs/common';
import type { UserByIdentifierQueryDto, UserByUsernameRowQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class VerificationQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryUserByUsername(username: string): Promise<UserByIdentifierQueryDto[]> {
    const [row] = await this.sql<UserByUsernameRowQueryDto[]>`
      SELECT guest_api.find_user_by_username(${username}) AS "userData"
    `;
    if (!row?.userData) return [];
    const { is_verified: isVerified, ...userData } = row.userData;
    return [{ ...userData, isVerified }];
  }

  async queryUpdateUserVerificationStatus(userId: string, state: boolean): Promise<void> {
    await this.sql`UPDATE identity.user AS users SET is_verified = ${state} WHERE users.id = ${userId}::uuid`;
  }
}
