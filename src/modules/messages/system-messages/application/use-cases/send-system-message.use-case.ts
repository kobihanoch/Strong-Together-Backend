import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../../../../common/application/ports/unit-of-work.port';
import { appConfig } from '../../../../../config/app.config';
import type { DeliveredMessage } from '../models/system-messages.models';
import { MessagePublisher } from '../ports/message-publisher.port';
import { SystemMessagesRepository } from '../ports/system-messages.repository';

/** Persists system messages and schedules their real-time delivery. */
@Injectable()
export class SendSystemMessageUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly repository: SystemMessagesRepository,
    private readonly publisher: MessagePublisher,
  ) {}

  /**
   * Persists a system message and publishes it after transaction commit.
   *
   * @param receiverId - The recipient user.
   * @param message - The subject and body to send.
   * @returns The persisted delivery message.
   */
  async execute(receiverId: string, message: { header: string; text: string }): Promise<DeliveredMessage> {
    return this.unitOfWork.execute(receiverId, async () => {
      const row = await this.repository.create(appConfig.systemUserId as string, receiverId, message.header, message.text);
      this.unitOfWork.afterCommit(async () => this.publisher.publishToUser(receiverId, row));
      return row;
    });
  }
}
