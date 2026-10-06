import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../infrastructure/connections/postgres/db.service';
import { AuthenticationTransaction } from '../application/ports/authentication-transaction.port';

/** Shared authentication transaction adapter backed by the request RLS transaction. */
@Injectable()
export class DbAuthenticationTransaction implements AuthenticationTransaction {
  constructor(private readonly db: DBService) {}

  promoteToUser(userId: string): Promise<void> {
    return this.db.promoteCurrentRlsTxToAuthenticated(userId);
  }
}
