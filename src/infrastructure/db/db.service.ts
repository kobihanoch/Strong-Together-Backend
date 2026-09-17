import { Inject, Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import dns from 'dns';
import { AsyncLocalStorage } from 'node:async_hooks';
import postgres from 'postgres';
import { createLogger } from '../logger';
import { DB_CLIENT } from './db.tokens';

interface DBStore {
  tx: postgres.Sql | postgres.TransactionSql;
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
  get sql(): postgres.Sql {
    const activeTx = this.als.getStore()?.tx;
    if (!activeTx) throw new InternalServerErrorException('Database access denied: query must run inside an active RLS context.');
    return activeTx;
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
  async runWithRlsTx<T>(userId: string | undefined, fn: () => Promise<T>): Promise<T> {
    return (await this.dbClient.begin(async (tx) => {
      if (!userId) {
        await tx`SET LOCAL ROLE guest`;
      } else {
        await tx`select set_config('app.current_user_id', ${userId}, true)`;
        await tx`SET LOCAL ROLE authenticated`;
      }
      return this.als.run({ tx }, fn);
    })) as T;
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
