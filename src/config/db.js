// English comments only inside code
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
