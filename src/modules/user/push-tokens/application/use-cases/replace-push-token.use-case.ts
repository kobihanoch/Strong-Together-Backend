import { Injectable } from '@nestjs/common';
import { PushTokensRepository } from '../ports/push-tokens.repository';
/** Replaces the push-notification token associated with a user. */
@Injectable()
export class ReplacePushTokenUseCase {
  constructor(private readonly repository: PushTokensRepository) {}
  /**
   * Stores a user's latest device push token.
   * @param userId - The user whose token is replaced.
   * @param token - The device push token.
   * @returns Nothing.
   */
  async execute(userId: string, token: string): Promise<void> {
    await this.repository.replace(userId, token);
  }
}
