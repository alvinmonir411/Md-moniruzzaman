import { neon } from "@neondatabase/serverless";

// Create Neon SQL client
const sql = neon(process.env.DATABASE_URL || "");

/**
 * Initializes database tables if they do not exist yet in Neon Postgres.
 */
export async function initDatabase() {
  if (!process.env.DATABASE_URL) return;

  try {
    // Projects table
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

    // Skills table
    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(100),
        proficiency VARCHAR(50),
        icon TEXT,
        description TEXT,
        tag VARCHAR(50),
        color VARCHAR(100),
        "order" INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Skills table column migrations
    await sql`
      ALTER TABLE skills ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE skills ADD COLUMN IF NOT EXISTS tag VARCHAR(50);
      ALTER TABLE skills ADD COLUMN IF NOT EXISTS color VARCHAR(100);
    `;

    // Messages table
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

    // Experience table
    await sql`
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) DEFAULT 'experience',
        role VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        timeline VARCHAR(100),
        location VARCHAR(255),
        tag VARCHAR(100),
        icon VARCHAR(50),
        is_live BOOLEAN DEFAULT false,
        details TEXT,
        highlights JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Experience table column migrations
    await sql`
      ALTER TABLE experience ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'experience';
      ALTER TABLE experience ADD COLUMN IF NOT EXISTS icon VARCHAR(50);
      ALTER TABLE experience ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT false;
      ALTER TABLE experience ADD COLUMN IF NOT EXISTS details TEXT;
    `;

    // Page Views table
    await sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id INT PRIMARY KEY DEFAULT 1,
        view_count INT DEFAULT 1,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Profile Settings table
    await sql`
      CREATE TABLE IF NOT EXISTS profile_settings (
        id INT PRIMARY KEY DEFAULT 1,
        name VARCHAR(255) DEFAULT 'Moniruzzaman',
        email VARCHAR(255) DEFAULT 'alvinmonir411@gmail.com',
        phone VARCHAR(100) DEFAULT '+8801979915165',
        whatsapp VARCHAR(100) DEFAULT '+8801979915165',
        github VARCHAR(255) DEFAULT 'https://github.com/alvinmonir411',
        linkedin VARCHAR(255) DEFAULT 'https://www.linkedin.com/in/moniruzzaman13663/',
        location VARCHAR(255) DEFAULT 'Dhaka & Rangpur, Bangladesh (UTC+6)',
        bio TEXT DEFAULT 'Engineering high-performance, scalable web apps with Next.js, React, and TypeScript.',
        title VARCHAR(255) DEFAULT 'Front-End & MERN Full-Stack Developer',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("✅ Neon DB tables initialized successfully.");
  } catch (error) {
    console.error("❌ Neon DB init error:", error);
  }
}

export default sql;
