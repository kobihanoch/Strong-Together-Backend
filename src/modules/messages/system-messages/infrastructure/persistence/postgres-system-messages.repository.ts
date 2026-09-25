import { Injectable } from '@nestjs/common';
import { CreateSql } from './writes/create.sql';
import type { DeliveredMessage } from '../../application/models/system-messages.models';
import { SystemMessagesRepository } from '../../application/ports/system-messages.repository';

/** PostgreSQL adapter for system-message persistence. */
@Injectable()
export class PostgresSystemMessagesRepository implements SystemMessagesRepository {
  public constructor(private readonly createSql: CreateSql) {}
  async create(senderId: string, receiverId: string, subject: string, message: string): Promise<DeliveredMessage> {
    const [created] = await this.createSql.create(senderId, receiverId, subject, message);
    return { ...created, sentAt: created.sentAt.toISOString() };
  }
}
