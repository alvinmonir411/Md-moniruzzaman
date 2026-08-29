import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_HkQEbax3e6LJ@ep-steep-haze-a5yvnqio-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function init() {
  const sql = neon(DATABASE_URL);
  
  console.log("Initializing Neon Postgres tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      tech TEXT,
      img TEXT,
      images JSONB DEFAULT '[]'::jsonb,
      live_url TEXT,
      github_url TEXT,
      category VARCHAR(50) DEFAULT 'custom',
      challenges_solutions TEXT,
      estimate_time VARCHAR(100),
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(100),
      proficiency VARCHAR(50),
      icon TEXT,
      "order" INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      role VARCHAR(255) NOT NULL,
      company VARCHAR(255) NOT NULL,
      timeline VARCHAR(100),
      location VARCHAR(255),
      tag VARCHAR(100),
      highlights JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `;

  console.log("✅ Neon DB tables verified:", tables.map(t => t.table_name));
}

init().catch(console.error);
