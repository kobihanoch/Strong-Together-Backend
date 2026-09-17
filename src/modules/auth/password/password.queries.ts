import { Injectable } from '@nestjs/common';
import { DBService } from '../../../infrastructure/db/db.service';

@Injectable()
export class PasswordQueries {
  constructor(private readonly dbService: DBService) {}

  /**
   * Updates user password.
   * @param userId - The user identifier.
   * @param passwordHash - The replacement password hash.
   */
  async queryUpdateUserPassword(userId: string, passwordHash: string): Promise<void> {
    await this.dbService.sql`
      UPDATE identity.user
      SET password_hash=${passwordHash}
      WHERE id=${userId}::uuid AND auth_provider='app'
    `;
  }
}
