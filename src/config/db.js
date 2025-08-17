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
};
export default sql;
