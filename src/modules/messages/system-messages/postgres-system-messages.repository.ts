import { Injectable } from '@nestjs/common';
import type { MessageAfterSendQueryDto } from '@strong-together/shared';
import { SystemMessagesQueries } from './system-messages.queries';
import { SystemMessagesRepository } from './system-messages.repository';

@Injectable()
export class PostgresSystemMessagesRepository implements SystemMessagesRepository {
  constructor(private readonly queries: SystemMessagesQueries) {}

  async createSystemMessage(senderId: string, receiverId: string, subject: string, message: string): Promise<MessageAfterSendQueryDto> {
    const [createdMessage] = await this.queries.queryCreateSystemMessage(senderId, receiverId, subject, message);
    return createdMessage;
  }
}
