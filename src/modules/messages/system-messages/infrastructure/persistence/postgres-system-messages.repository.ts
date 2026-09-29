import { Injectable } from '@nestjs/common';
import { CreateSql } from './writes/create.sql';
import { SystemMessagesRepository } from '../../application/ports/system-messages.repository';
import { Message } from '../../../domain/entities/message';

/** PostgreSQL adapter for system-message persistence. */
@Injectable()
export class PostgresSystemMessagesRepository implements SystemMessagesRepository {
  public constructor(private readonly createSql: CreateSql) {}
  async create(message: Message): Promise<Message> {
    const created = await this.createSql.create(message.senderId, message.receiverId, message.subject, message.body);
    return Message.restore({ ...created, body: created.msg });
  }
}
