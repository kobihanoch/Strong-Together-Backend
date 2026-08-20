import { Inject, Injectable } from '@nestjs/common';
import type { UserByIndetifier } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class VerificationQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryUserByUsername(username: string): Promise<UserByIndetifier[]> {
    type VerificationUserDbResult = Omit<UserByIndetifier, 'isVerified'> & { is_verified: boolean };
    const [row] = await this.sql<{ userData: VerificationUserDbResult | null }[]>`
      SELECT guest_api.find_user_by_username(${username}) AS "userData"
    `;
    if (!row?.userData) return [];
    const { is_verified: isVerified, ...userData } = row.userData;
    return [{ ...userData, isVerified }];
  }

  async queryUpdateUserVerficiationStatus(userId: string, state: boolean): Promise<void> {
    await this.sql`UPDATE identity.user AS users SET is_verified = ${state} WHERE users.id = ${userId}::uuid`;
  }
}
