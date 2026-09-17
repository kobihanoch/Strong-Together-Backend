import { Injectable } from '@nestjs/common';
import type { UserByIdentifierQueryDto, UserByUsernameRowQueryDto } from '@strong-together/shared';
import { DBService } from '../../../infrastructure/db/db.service';

@Injectable()
export class VerificationQueries {
  constructor(private readonly dbService: DBService) {}

  /**
   * User by username.
   * @param username - The username.
   * @returns The user by username result.
   */
  async queryUserByUsername(username: string): Promise<UserByIdentifierQueryDto[]> {
    const [row] = await this.dbService.sql<UserByUsernameRowQueryDto[]>`
      SELECT guest_api.find_user_by_username(${username}) AS "userData"
    `;
    if (!row?.userData) return [];
    const { password_hash: passwordHash, is_verified: isVerified, ...userData } = row.userData;
    return [{ ...userData, passwordHash, isVerified }];
  }

  /**
   * Updates user verification status.
   * @param userId - The user identifier.
   * @param state - The verification state to store.
   */
  async queryUpdateUserVerificationStatus(userId: string, state: boolean): Promise<void> {
    await this.dbService.sql`UPDATE identity.user AS users SET is_verified = ${state} WHERE users.id = ${userId}::uuid`;
  }
}
