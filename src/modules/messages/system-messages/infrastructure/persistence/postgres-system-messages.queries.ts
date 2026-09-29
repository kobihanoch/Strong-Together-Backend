import { Injectable } from '@nestjs/common';
import type { DeliveredMessage } from '../../application/models/system-messages.models';
import { SystemMessagesQueries } from '../../application/ports/system-messages.queries';
import { FindDeliveredByIdSql } from './reads/find-delivered-by-id.sql';

@Injectable()
export class PostgresSystemMessagesQueries implements SystemMessagesQueries {
  constructor(private readonly findDeliveredByIdSql: FindDeliveredByIdSql) {}
  async findDeliveredById(messageId: string): Promise<DeliveredMessage | undefined> {
    const message = await this.findDeliveredByIdSql.findDeliveredById(messageId);
    return message ? { ...message, sentAt: message.sentAt.toISOString() } : undefined;
  }
}
