import { neon } from "@neondatabase/serverless";
import fs from "fs";

const DATABASE_URL = "postgresql://neondb_owner:npg_HkQEbax3e6LJ@ep-steep-haze-a5yvnqio-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function seed() {
  const sql = neon(DATABASE_URL);
  
  // Check if projects already exist
  const existing = await sql`SELECT count(*) FROM projects;`;
  if (parseInt(existing[0].count) > 0) {
    console.log("Projects table already has data. Count:", existing[0].count);
    return;
  }

  const raw = fs.readFileSync("./public/Projects.json", "utf-8");
  const projects = JSON.parse(raw);

  for (const p of projects) {
    const techStr = Array.isArray(p.tech) ? p.tech.join(", ") : (p.tech || "");
    await sql`
      INSERT INTO projects (
        title,
        description,
        tech,
        live_url,
        github_url,
        category,
        is_featured
      )
      VALUES (
        ${p.title},
        ${p.desc || p.description || ""},
        ${techStr},
        ${p.live || ""},
        ${p.github || ""},
        ${p.category || "custom"},
        true
      );
    `;
    console.log("Seeded project:", p.title);
  }

  console.log("✅ Seed completed successfully!");
}

seed().catch(console.error);
