import dns from 'dns';
import { RequestHandler } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import postgres from 'postgres';
import { createLogger } from './logger.ts';

dns.setDefaultResultOrder('ipv4first');

const connectionString = process.env.DATABASE_URL;

// Base pool client (PgBouncer safe)
function makeClient(): postgres.Sql {
  return postgres(connectionString!, {
    ssl: process.env.NODE_ENV === 'test' ? false : 'require',
    prepare: false,
    connect_timeout: 30,
  });
}

// SQL Instance and logger
let _sql = makeClient();
const logger = createLogger('config:db');

// Async local storage for inner handler
const als = new AsyncLocalStorage<{
  tx: postgres.Sql | postgres.TransactionSql;
  userId?: string;
}>();

// Cיheck if TransientConnError
function isTransientConnError(err: any): boolean {
  const msg = String(err?.message || '');
  return /CONNECTION_ENDED|ECONNRESET|terminat(ed|ion)/i.test(msg);
}

// Global tagged template: prefers the request-bound tx when present
const sql = (async (strings: TemplateStringsArray, ...values: any[]) => {
  // Check if exists running transaction
  const store = als.getStore(); //
  const runner = store?.tx || _sql;
  try {
    return await runner(strings, ...values);
  } catch (err) {
    // If eror is not due connection throw to error handler (any SQL errors or server errors)
    if (!isTransientConnError(err) || store?.tx) throw err;

    // If eror is due connection try to create a new instance
    try {
      await _sql.end({ timeout: 1 });
    } catch {}
    _sql = makeClient();
    return _sql(strings, ...values);
  }
}) as postgres.Sql;

// Nested transactions
(sql as any).begin = async (fn: (tx: postgres.TransactionSql) => Promise<any>) => {
  const store = als.getStore();
  const runner = store?.tx || _sql;
  return runner.begin(fn);
};

// Wrap a protected route with a single tx + injected claims (RLS)
export const withRlsTx = (handler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    // If not authed
    const userId = req.user?.id;
    if (!userId) {
      return handler(req, res, next);
    }
    // If authed
    return await _sql.begin(async (tx) => {
      const claims = JSON.stringify({
        sub: userId,
        role: 'authenticated',
        aud: 'authenticated',
      });
      await tx`select set_config('request.jwt.claims', ${claims}, true)`;
      await tx`SET LOCAL ROLE authenticated`;

      return als.run({ tx }, async () => {
        return handler(req, res, next);
      });
    });
  };
};

export const connectDB = async (): Promise<void> => {
  try {
    await sql<{ connected: number }[]>`select 1 as connected`;
    logger.info({ event: 'db.connected' }, 'Connected to Postgres');
  } catch (err: any) {
    logger.error({ err, event: 'db.connection_failed' }, 'Connection to Postgres failed');
  }
};

export default sql as postgres.Sql & {
  begin: <T>(fn: (tx: postgres.TransactionSql) => Promise<T>) => Promise<T>;
};
