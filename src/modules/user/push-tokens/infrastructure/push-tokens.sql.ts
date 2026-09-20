import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/db/db.service';
/** Executes push-token persistence queries. */
@Injectable()
export class PushTokensSql {
  constructor(private readonly db: DBService) {}
  async replace(userId: string, token: string): Promise<void> {
    await this.db.sql`UPDATE identity.user SET push_token=${token} WHERE id=${userId}::uuid`;
  }
}
