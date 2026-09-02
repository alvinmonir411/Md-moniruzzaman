const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../../.env.local");
const envContent = fs.readFileSync(envPath, "utf8");
let dbUrl = "";
for (const line of envContent.split("\n")) {
  if (line.startsWith("DATABASE_URL=")) {
    dbUrl = line.split("=")[1].trim().replace(/^["']|["']$/g, "");
    break;
  }
}

console.log("DB URL found:", dbUrl ? dbUrl.slice(0, 20) + "..." : "NONE");

const { neon } = require("@neondatabase/serverless");
const sql = neon(dbUrl);

async function run() {
  try {
    const cols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'skills';
    `;
    console.log("Columns:", cols);

    const rows = await sql`SELECT * FROM skills;`;
    console.log("Current skills count in Neon DB:", rows.length);
  } catch (err) {
    console.error("DB Error:", err);
  }
}

run();
