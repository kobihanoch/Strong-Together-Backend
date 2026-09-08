import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import dns from 'dns';
import { AsyncLocalStorage } from 'node:async_hooks';
import postgres from 'postgres';
import { createLogger } from '../logger';
import { DB_CLIENT } from './db.tokens';

interface DBStore {
  tx: postgres.Sql | postgres.TransactionSql;
  userId?: string;
}

dns.setDefaultResultOrder('ipv4first');

@Injectable()
export class DBService implements OnModuleDestroy, OnModuleInit {
  private readonly logger = createLogger('config:db');
  // Async local storage for inner handler
  private readonly als = new AsyncLocalStorage<DBStore>();
  private readonly sqlInstance: postgres.Sql;

  constructor(@Inject(DB_CLIENT) private readonly dbClient: postgres.Sql) {
    this.sqlInstance = this.initSqlBehavior();
  }

  /**
   * Initializes the service when its module starts.
   */
  async onModuleInit() {
    try {
      await this.sql`select 1 as connected`;
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
        return this.als.run({ tx }, fn);
      } else {
        await tx`select set_config('app.current_user_id', ${userId}, true)`;
        await tx`SET LOCAL ROLE authenticated`;
        return this.als.run({ tx, userId }, fn);
      }
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
    store.userId = userId;
  }

  /**
   * Is transient conn error.
   * @param err - The error to inspect.
   * @returns The is transient conn error result.
   */
  private isTransientConnError(err: any): boolean {
    const msg = String(err?.message || '');
    return /CONNECTION_ENDED|ECONNRESET|terminat(ed|ion)/i.test(msg);
  }

  /**
   * Init sql behavior.
   * @returns The init sql behavior result.
   */
  private initSqlBehavior(): postgres.Sql {
    // Global tagged template: prefers the request-bound tx when present
    const proxy = (async (strings: TemplateStringsArray, ...values: any[]) => {
      // Check if exists running transaction
      const store = this.als.getStore(); //
      const runner = store?.tx || this.dbClient;
      try {
        return await runner(strings, ...values);
      } catch (err) {
        // If eror is not due connection throw to error handler (any SQL errors or server errors)
        if (!this.isTransientConnError(err) || store?.tx) throw err;

        // If eror is due connection try to create a new instance
        this.logger.warn({ err }, 'Database transient error, retrying once...');

        return this.dbClient(strings, ...values);
      }
    }) as any;

    proxy.begin = async (fn: (tx: postgres.TransactionSql) => Promise<any>) => {
      const store = this.als.getStore();
      // Requests already run inside the RLS transaction. Reuse it instead of
      // trying to open an unsupported nested transaction on TransactionSql.
      if (store?.tx) return fn(store.tx as postgres.TransactionSql);
      return this.dbClient.begin(fn);
    };

    return proxy;
  }

  // Later exposed as SQL token tag
  get sql(): postgres.Sql {
    return this.sqlInstance;
  }
}
