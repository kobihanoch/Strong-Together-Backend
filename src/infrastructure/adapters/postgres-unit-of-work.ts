import { Injectable } from '@nestjs/common';
import { UnitOfWork } from '../../common/application/ports/unit-of-work.port';
import { DBService } from '../connections/postgres/db.service';

/** PostgreSQL-backed application unit of work with RLS-aware transactions. */
@Injectable()
export class PostgresUnitOfWork implements UnitOfWork {
  public constructor(private readonly database: DBService) {}

  public execute<T>(userId: string | undefined, operation: () => Promise<T>): Promise<T> {
    return this.database.withRlsTransaction(userId, operation);
  }

  public afterCommit(operation: () => Promise<void>): void {
    this.database.afterCommit(operation);
  }
}
