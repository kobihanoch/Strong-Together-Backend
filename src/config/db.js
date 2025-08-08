import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export default supabase;

export const connectDB = async () => {
  try {
    await supabase.from("users").select("username").limit(1);
    console.log("✅ Connected to Supabase successfully!");
  } catch (err) {
    console.error("❌ Failed to connect to Supabase:", err.message);
    process.exit(1);
  }
};
