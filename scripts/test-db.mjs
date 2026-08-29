import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_HkQEbax3e6LJ@ep-steep-haze-a5yvnqio-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function run() {
  try {
    const sql = neon(DATABASE_URL);
    const res = await sql`SELECT NOW() as current_time, version();`;
    console.log("✅ Neon DB Connection SUCCESS!");
    console.log("Current DB Time:", res[0].current_time);
    console.log("PostgreSQL Version:", res[0].version);
  } catch (err) {
    console.error("❌ Neon DB Connection Error:", err);
  }
}

run();
