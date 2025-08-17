import postgres from "postgres";

import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);

// Check DB connection
export const connectDB = async () => {
  try {
    await sql`SELECT 1 as connected`;
    console.log("Connected to Postgres.");
  } catch (err) {
    console.log("Connection to Postgres has failed.", err.message);
  }
  /*(async () => {
    const [{ current_user }] = await sql`select current_user`;
    const [r] = await sql`
    select rolsuper, rolbypassrls
    from pg_roles
    where rolname = current_user
  `;
    console.log({
      current_user,
      rolsuper: r.rolsuper,
      rolbypassrls: r.rolbypassrls,
    });
    await sql.end();
  })();*/
};
export default sql;
