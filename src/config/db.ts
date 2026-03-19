import postgres from "postgres";
import dns from "dns";
import { AsyncLocalStorage } from "node:async_hooks";
import { Request, Response, NextFunction } from "express";

dns.setDefaultResultOrder("ipv4first");

const connectionString = process.env.DATABASE_URL;

// Base pool client (PgBouncer safe)
function makeClient(): postgres.Sql {
  return postgres(connectionString!, {
    ssl: "require",
    prepare: false, // safer with transaction pooling
    connect_timeout: 30,
  });
}

let _sql = makeClient();

// Per-request context: { tx, userId }
const als = new AsyncLocalStorage<{
  tx: postgres.Sql | postgres.TransactionSql;
  userId?: string;
}>();

// Detect transient connection errors
function isTransientConnError(err: any): boolean {
  const msg = String(err?.message || "");
  return /CONNECTION_ENDED|ECONNRESET|terminat(ed|ion)/i.test(msg);
}

// Global tagged template: prefers the request-bound tx when present
async function sql(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<any> {
  const store = als.getStore();
  const runner = store?.tx || _sql;

  try {
    return await runner(strings, ...values);
  } catch (err) {
    if (!isTransientConnError(err) || store?.tx) throw err; // don't recycle inside active tx
    try {
      await _sql.end({ timeout: 1 });
    } catch {}
    _sql = makeClient();
    return _sql(strings, ...values);
  }
}

// Optional: manual transaction if you ever need it
(sql as any).begin = async (
  fn: (tx: postgres.TransactionSql) => Promise<any>,
): Promise<any> => {
  const store = als.getStore();
  const runner = (store?.tx || _sql) as postgres.Sql;
  return runner.begin(fn as any);
};

// Wrap a protected route with a single tx + injected claims (RLS)
export const withRlsTx = (handler: Function) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const userId = req.user?.id; // set by your auth middleware
    if (!userId) return handler(req, res, next); // public route

    try {
      await _sql.begin(async (tx) => {
        // Inject claims so auth.uid() works in RLS policies
        const claims = JSON.stringify({
          sub: userId,
          role: "authenticated",
          aud: "authenticated",
        });
        await tx`select set_config('request.jwt.claims', ${claims}, true)`;
        await tx`SET LOCAL ROLE authenticated`;

        // Bind this tx to the request's async call chain; no req.sql needed
        await als.run({ tx }, async () => {
          await handler(req, res, next);
        });
      });
    } catch (e) {
      next(e);
    }
  };
};

// Quick connectivity check (optional)
export const connectDB = async (): Promise<void> => {
  try {
    await sql`select 1 as connected`;
    console.log("[Postgres]: Connected to Postgres.");
  } catch (err: any) {
    console.log("[Postgres]: Connection to Postgres has failed.", err.message);
  }
};

export default sql as unknown as postgres.Sql & {
  begin: <T>(fn: (tx: postgres.TransactionSql) => Promise<T>) => Promise<T>;
};
