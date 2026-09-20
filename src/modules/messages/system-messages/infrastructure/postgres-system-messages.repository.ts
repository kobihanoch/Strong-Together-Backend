import { Injectable } from '@nestjs/common';
import type { DeliveredMessage } from '../application/models/system-messages.models';
import { SystemMessagesRepository } from '../application/ports/system-messages.repository';
import { SystemMessagesSql } from './system-messages.sql';

/** PostgreSQL adapter for system-message persistence. */
@Injectable()
export class PostgresSystemMessagesRepository implements SystemMessagesRepository {
  constructor(private readonly sql: SystemMessagesSql) {}
  async create(senderId: string, receiverId: string, subject: string, message: string): Promise<DeliveredMessage> {
    const [created] = await this.sql.create(senderId, receiverId, subject, message);
    return { ...created, sentAt: created.sentAt.toISOString() };
  }
}
