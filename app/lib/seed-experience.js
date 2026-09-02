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

const { neon } = require("@neondatabase/serverless");
const sql = neon(dbUrl);

const DEFAULT_EXPERIENCES = [
  {
    type: "experience",
    role: "Wix Developer",
    company: "SM Technology",
    timeline: "2024 – Present",
    location: "Rangpur / Remote",
    tag: "Live Experience",
    icon: "💼",
    is_live: true,
    details: "",
    highlights: [
      "Active commercial experience in production-grade Wix and web engineering.",
      "Engineered tailored corporate websites with high SEO scores and responsive cross-device layouts.",
      "Collaborated with clients to translate business requirements into intuitive UI/UX workflows.",
      "Optimized load speeds, customized Velo/JavaScript scripts, and handled deployment pipelines.",
    ],
  },
  {
    type: "experience",
    role: "Independent Full-Stack Developer",
    company: "Freelance & Open Source",
    timeline: "2023 – Present",
    location: "Remote",
    tag: "Active",
    icon: "🚀",
    is_live: false,
    details: "",
    highlights: [
      "Built 100+ full-stack MERN, Next.js & web applications with authentication, databases, and payment flows.",
      "Maintained 100% client satisfaction and delivered modern, accessible codebases.",
    ],
  },
  {
    type: "education",
    role: "Bachelor of Social Science (BSS)",
    company: "Govt. Begum Rokeya College, Rangpur",
    timeline: "2022 – Expected 2026",
    location: "Rangpur, Bangladesh",
    tag: "Higher Education",
    icon: "🎓",
    is_live: false,
    details: "Focusing on analytical problem solving, social dynamics, communication, and software research.",
    highlights: [],
  },
  {
    type: "education",
    role: "Higher Secondary Certificate (HSC)",
    company: "Cantonment Public School & College, Rangpur",
    timeline: "2020 – 2022",
    location: "Rangpur, Bangladesh",
    tag: "Science Background",
    icon: "🏫",
    is_live: false,
    details: "Excelled in core science disciplines, mathematical logic, and analytical problem-solving foundation.",
    highlights: [],
  },
  {
    type: "education",
    role: "Secondary School Certificate (SSC)",
    company: "R.K.M School & College, Rangpur",
    timeline: "2018 – 2020",
    location: "Rangpur, Bangladesh",
    tag: "Graduated with Honors",
    icon: "📘",
    is_live: false,
    details: "Built initial passion for computers, programming fundamentals, algorithms, and web technologies.",
    highlights: [],
  },
];

async function runMigration() {
  try {
    console.log("1. Adding columns to experience table...");
    await sql`ALTER TABLE experience ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'experience';`;
    await sql`ALTER TABLE experience ADD COLUMN IF NOT EXISTS icon VARCHAR(50);`;
    await sql`ALTER TABLE experience ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT false;`;
    await sql`ALTER TABLE experience ADD COLUMN IF NOT EXISTS details TEXT;`;
    console.log("✓ Columns added!");

    console.log("2. Inserting 5 verified experience and education records...");
    await sql`DELETE FROM experience;`;

    for (const item of DEFAULT_EXPERIENCES) {
      await sql`
        INSERT INTO experience (type, role, company, timeline, location, tag, icon, is_live, details, highlights)
        VALUES (
          ${item.type},
          ${item.role},
          ${item.company},
          ${item.timeline},
          ${item.location},
          ${item.tag},
          ${item.icon},
          ${item.is_live},
          ${item.details},
          ${JSON.stringify(item.highlights)}::jsonb
        );
      `;
    }

    const rows = await sql`SELECT * FROM experience;`;
    console.log("✓ Experience & Education seeded! Total count in Neon DB:", rows.length);
  } catch (err) {
    console.error("Migration error:", err);
  }
}

runMigration();
