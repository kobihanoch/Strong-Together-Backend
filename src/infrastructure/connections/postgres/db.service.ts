import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import dns from 'dns';
import { AsyncLocalStorage } from 'node:async_hooks';
import postgres from 'postgres';
import { createLogger } from '../../capabilities/observability/logger';
import { captureWorkerException } from '../../capabilities/observability/sentry';
import { DB_CLIENT } from './db.tokens';

/** Describes the dbstore shape. */
interface DBStore {
  tx: postgres.TransactionSql;
  mode: 'read-only' | 'read-write';
  afterCommit: Array<() => Promise<void>>;
}

dns.setDefaultResultOrder('ipv4first');

@Injectable()
export class DBService implements OnModuleDestroy, OnModuleInit {
  private readonly logger = createLogger('config:db');
  // Async local storage for inner handler
  private readonly als = new AsyncLocalStorage<DBStore>();

  constructor(@Inject(DB_CLIENT) private readonly dbClient: postgres.Sql) {}

  /**
   *  User flow SQL tag
   */
  get sql(): postgres.TransactionSql {
    const store = this.als.getStore();
    if (!store) throw new Error('Database access must occur inside a UnitOfWork transaction');
    return store.tx;
  }

  /**
   * Initializes the service when its module starts.
   */
  async onModuleInit() {
    try {
      await this.dbClient`
        SELECT
          1 AS connected
      `;
      this.logger.info({ event: 'db.connected' }, 'Connected to Postgres');
    } catch (err) {
      this.logger.error({ err, event: 'db.connection_failed' }, 'Connection to Postgres failed');
    }
  }

  /**
   * Releases service resources when its module shuts down.
   */
  async onModuleDestroy() {
    await this.dbClient.end({ timeout: 5 });
  }

  /**
   * Run with rls tx.
   * @param userId - The user identifier.
   * @param fn - The fn.
   * @returns The run with rls tx result.
   */
  async withRlsTransaction<T>(userId: string | undefined, operation: () => Promise<T>): Promise<T> {
    const store = this.als.getStore();
    if (store) {
      if (store.mode === 'read-only') throw new Error('Cannot execute a read-write operation inside a read-only transaction');
      return operation();
    }

    return this.withTransaction(userId, 'read-write', operation);
  }

  /**
   * Runs an operation inside a read-only RLS transaction.
   * @param userId - The user identifier.
   * @param operation - The operation to execute.
   * @returns The operation result.
   */
  async withReadOnlyRlsTransaction<T>(userId: string | undefined, operation: () => Promise<T>): Promise<T> {
    if (this.als.getStore()) return operation();

    return this.withTransaction(userId, 'read-only', operation);
  }

  private async withTransaction<T>(userId: string | undefined, mode: DBStore['mode'], operation: () => Promise<T>): Promise<T> {
    const afterCommit: Array<() => Promise<void>> = [];
    const result = await this.dbClient.begin(async (tx) => {
      if (mode === 'read-only') await tx`SET TRANSACTION READ ONLY`;
      if (!userId) {
        await tx`SET LOCAL ROLE guest`;
      } else {
        await tx`select set_config('app.current_user_id', ${userId}, true)`;
        await tx`SET LOCAL ROLE authenticated`;
      }
      return this.als.run({ tx, mode, afterCommit }, operation);
    });

    const outcomes = await Promise.allSettled(afterCommit.map((callback) => callback()));
    outcomes.forEach((outcome, callbackIndex) => {
      if (outcome.status === 'fulfilled') return;

      this.logger.error({ err: outcome.reason, event: 'db.after_commit_failed', callbackIndex }, 'After-commit operation failed');
      captureWorkerException(outcome.reason, { event: 'db.after_commit_failed', callbackIndex, userId });
    });

    return result as T;
  }

  /**
   * Registers external work to run only after the active request transaction commits.
   * @param callback - The external work to perform after commit.
   */
  afterCommit(callback: () => Promise<void>): void {
    const store = this.als.getStore();
    if (!store) throw new Error('No active RLS transaction');
    store.afterCommit.push(callback);
  }

  /**
   * Promotes current rls tx to authenticated.
   * @param userId - The user identifier.
   */
  async promoteCurrentRlsTxToAuthenticated(userId: string): Promise<void> {
    const store = this.als.getStore();
    if (!store) throw new Error('No active RLS transaction');

    await store.tx`select set_config('app.current_user_id', ${userId}, true)`;
    await store.tx`SET LOCAL ROLE authenticated`;
  }
}
