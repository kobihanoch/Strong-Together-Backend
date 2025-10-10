import postgres from "postgres";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

const connectionString = process.env.DATABASE_URL;

// Factory with safe options for PgBouncer/Supabase
function makeClient() {
  return postgres(connectionString, {
    ssl: "require", // Supabase requires SSL
    prepare: false, // safer behind PgBouncer (transaction pooling)
    connect_timeout: 30,
  });
}

let _sql = makeClient();

// Detect transient connection errors
function isTransientConnError(err) {
  const msg = String(err?.message || "");
  return /CONNECTION_ENDED|ECONNRESET|terminat(ed|ion)/i.test(msg);
}

// Tagged template proxy with auto-reconnect on transient errors
async function sqlTag(strings, ...values) {
  try {
    return await _sql(strings, ...values);
  } catch (err) {
    if (!isTransientConnError(err)) throw err;
    try {
      await _sql.end({ timeout: 1 });
    } catch {}
    _sql = makeClient();
    return _sql(strings, ...values);
  }
}

// Also proxy .begin with the same reconnect behavior
sqlTag.begin = async (fn) => {
  try {
    return await _sql.begin(fn);
  } catch (err) {
    if (!isTransientConnError(err)) throw err;
    try {
      await _sql.end({ timeout: 1 });
    } catch {}
    _sql = makeClient();
    return _sql.begin(fn);
  }
};

// RLS
export const withRlsTx = (handler) => {
  return async (req, res, next) => {
    const userId = req.user?.id; // From auth middleware
    console.log("RLS:", userId);
    if (!userId) return handler(req, res, next); // public route -> no RLS injection

    try {
      await _sql.begin(async (tx) => {
        // Inject claims so auth.uid() works in RLS policies
        const claims = JSON.stringify({
          sub: userId,
          role: "authenticated",
          aud: "authenticated",
        });
        await tx`select set_config('request.jwt.claims', ${claims}, true)`;

        // Expose the tx-bound client on the request
        req.sql = tx;

        // Run the actual handler; all DB calls must use req.sql here
        await handler(req, res, next);
      });
    } catch (e) {
      next(e);
    }
  };
};

// Optional: quick connectivity check on boot
export const connectDB = async () => {
  try {
    await sqlTag`select 1 as connected`;
    console.log("Connected to Postgres.");
  } catch (err) {
    console.log("Connection to Postgres has failed.", err.message);
  }
};

export default sqlTag;
