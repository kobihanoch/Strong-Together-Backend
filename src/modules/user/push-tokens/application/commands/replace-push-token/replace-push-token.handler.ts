import { UnitOfWork } from '../../../../../../common/application/ports/unit-of-work.port';
import { PushTokensRepository } from '../../ports/push-tokens.repository';
import { DevicePushToken } from '../../../domain/value-objects/device-push-token';
import { ReplacePushTokenCommand } from './replace-push-token.command';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
/** Replaces the push-notification token associated with a user. */
@CommandHandler(ReplacePushTokenCommand)
export class ReplacePushTokenHandler implements ICommandHandler<ReplacePushTokenCommand> {
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
  async execute(command: ReplacePushTokenCommand): Promise<void> {
    const { userId, token } = command;
    return this.unitOfWork.execute(userId, async () => {
      await this.repository.replace(new DevicePushToken(token));
    });
  }
}
