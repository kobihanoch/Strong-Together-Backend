import { Injectable } from '@nestjs/common';
import { DBService } from '../../../infrastructure/db/db.service';

@Injectable()
export class PushTokensQueries {
  constructor(private readonly dbService: DBService) {}

  /**
   * Saves user push token.
   * @param userId - The user identifier.
   * @param token - The token to process.
   */
  async querySaveUserPushToken(userId: string, token: string): Promise<void> {
    await this.dbService.sql`UPDATE identity.user SET push_token=${token} WHERE id=${userId}::uuid`;
  }
}
