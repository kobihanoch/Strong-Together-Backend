import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
/** Executes user profile SQL operations. */

@Injectable()
export class UpdateProfilePictureSql {
  constructor(private readonly db: DBService) {}
  /**
   * Executes the update profile picture SQL operation.
   *
   * @param userId - The user identifier.
   * @param path - The path value.
   * @returns A promise that resolves when the operation completes.
   */
  async updateProfilePicture(userId: string, path: string | null): Promise<void> {
    await this.db.sql`
      UPDATE identity.user
      SET
        profile_pic_path = ${path}
      WHERE
        id = ${userId}::UUID
    `;
  }
}
