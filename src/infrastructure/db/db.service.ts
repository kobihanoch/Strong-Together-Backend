import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import dns from 'dns';
import { AsyncLocalStorage } from 'node:async_hooks';
import postgres from 'postgres';
import { createLogger } from '../logger.ts';
import { DB_CLIENT } from './db.tokens.ts';

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

  async onModuleInit() {
    try {
      await this.sql`select 1 as connected`;
      this.logger.info({ event: 'db.connected' }, 'Connected to Postgres');
    } catch (err) {
      this.logger.error({ err, event: 'db.connection_failed' }, 'Connection to Postgres failed');
    }
  }

  async onModuleDestroy() {
    await this.dbClient.end({ timeout: 5 });
  }

  async runWithRlsTx<T>(userId: string | undefined, fn: () => Promise<T>): Promise<T> {
    if (!userId) return fn();

    return (await this.dbClient.begin(async (tx) => {
      await tx`select set_config('app.current_user_id', ${userId}, true)`;
      await tx`SET LOCAL ROLE authenticated`;

      return this.als.run({ tx, userId }, fn);
    })) as T;
  }

  private isTransientConnError(err: any): boolean {
    const msg = String(err?.message || '');
    return /CONNECTION_ENDED|ECONNRESET|terminat(ed|ion)/i.test(msg);
  }

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
      const runner = store?.tx || this.dbClient;
      return runner.begin(fn);
    };

    return proxy;
  }

  // Later exposed as SQL token tag
  get sql(): postgres.Sql {
    return this.sqlInstance;
  }
}
