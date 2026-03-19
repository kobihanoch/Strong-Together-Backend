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

const als = new AsyncLocalStorage<{
  tx: postgres.Sql | postgres.TransactionSql;
  userId?: string;
}>();

function isTransientConnError(err: any): boolean {
  const msg = String(err?.message || "");
  return /CONNECTION_ENDED|ECONNRESET|terminat(ed|ion)/i.test(msg);
}

// Global tagged template: prefers the request-bound tx when present
const sql = ((strings: TemplateStringsArray, ...values: any[]) => {
  const store = als.getStore();
  const runner = store?.tx || _sql;

  return runner(strings, ...values).catch(async (err) => {
    if (!isTransientConnError(err) || store?.tx) throw err;
    try {
      await _sql.end({ timeout: 1 });
    } catch {}
    _sql = makeClient();
    return _sql(strings, ...values);
  });
}) as postgres.Sql;

(sql as any).begin = async (
  fn: (tx: postgres.TransactionSql) => Promise<any>,
) => {
  const store = als.getStore();
  const runner = (store?.tx || _sql) as postgres.Sql;
  return runner.begin(fn as any);
};

// Wrap a protected route with a single tx + injected claims (RLS)
export const withRlsTx = <ReqP, ResBody, ReqBody, ReqQuery>(
  handler: (
    req: Request<ReqP, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => Promise<void | Response<ResBody>>,
): ((
  req: Request<ReqP, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
) => void) => {
  return async (req, res, next) => {
    const userId = (req as any).user?.id;
    if (!userId) return handler(req, res, next);

    try {
      await _sql.begin(async (tx) => {
        const claims = JSON.stringify({
          sub: userId,
          role: "authenticated",
          aud: "authenticated",
        });
        await tx`select set_config('request.jwt.claims', ${claims}, true)`;
        await tx`SET LOCAL ROLE authenticated`;

        await als.run({ tx }, async () => {
          await handler(req, res, next);
        });
      });
    } catch (e) {
      next(e);
    }
  };
};

export const connectDB = async (): Promise<void> => {
  try {
    await sql<{ connected: number }[]>`select 1 as connected`;
    console.log("[Postgres]: Connected to Postgres.");
  } catch (err: any) {
    console.log("[Postgres]: Connection to Postgres has failed.", err.message);
  }
};

export default sql as postgres.Sql & {
  begin: <T>(fn: (tx: postgres.TransactionSql) => Promise<T>) => Promise<T>;
};
