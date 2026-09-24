import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { PushTokensRepository } from '../ports/push-tokens.repository';
/** Replaces the push-notification token associated with a user. */
@Injectable()
export class ReplacePushTokenUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: PushTokensRepository,
  ) {}
  /**
   * Stores a user's latest device push token.
   *
   * @param userId - The user whose token is replaced.
   * @param token - The device push token.
   * @returns Nothing.
   */
  async execute(userId: string, token: string): Promise<void> {
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.replace(userId, token);
    });
  }
}
