import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';

@Injectable()
export class DeleteSql {
  constructor(private readonly db: DBService) {}
  async delete(messageId: string): Promise<void> {
    await this.db.sql`DELETE FROM messages.message WHERE id = ${messageId}::UUID`;
  }
}
