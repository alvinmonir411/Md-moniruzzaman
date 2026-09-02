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

const DEFAULT_SKILLS = [
  // Frontend
  {
    name: "React.js",
    category: "frontend",
    proficiency: "95",
    icon: "⚛️",
    color: "from-cyan-500 to-blue-500",
    description: "Custom hooks, Context API, state optimization, concurrent mode.",
    tag: "Expert",
    order: 1,
  },
  {
    name: "Next.js (App Router)",
    category: "frontend",
    proficiency: "92",
    icon: "🚀",
    color: "from-slate-300 to-slate-600",
    description: "SSR, SSG, Server Actions, route handlers, dynamic SEO optimization.",
    tag: "Advanced",
    order: 2,
  },
  {
    name: "TypeScript",
    category: "frontend",
    proficiency: "90",
    icon: "🟦",
    color: "from-blue-500 to-indigo-600",
    description: "Generics, strict typing, interfaces, utility types, clean schemas.",
    tag: "Advanced",
    order: 3,
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    proficiency: "98",
    icon: "💨",
    color: "from-teal-400 to-cyan-500",
    description: "Responsive layouts, custom utilities, modern dark/light theming.",
    tag: "Master",
    order: 4,
  },
  {
    name: "Redux Toolkit / Zustand",
    category: "frontend",
    proficiency: "88",
    icon: "🔴",
    color: "from-purple-500 to-pink-500",
    description: "Global state management, slices, async thunks, persistence.",
    tag: "Advanced",
    order: 5,
  },
  {
    name: "JavaScript (ES6+)",
    category: "frontend",
    proficiency: "95",
    icon: "⚡",
    color: "from-yellow-400 to-amber-500",
    description: "Async/await, closures, prototypes, event loops, DOM manipulation.",
    tag: "Expert",
    order: 6,
  },
  {
    name: "HTML5 & CSS3 Animations",
    category: "frontend",
    proficiency: "96",
    icon: "🎨",
    color: "from-orange-500 to-rose-500",
    description: "Semantic HTML, flexbox/grid, keyframe animations, glassmorphism.",
    tag: "Master",
    order: 7,
  },
  // Backend
  {
    name: "Node.js",
    category: "backend",
    proficiency: "85",
    icon: "🟢",
    color: "from-emerald-500 to-green-600",
    description: "Event-driven runtime, asynchronous architecture, backend APIs.",
    tag: "Proficient",
    order: 8,
  },
  {
    name: "Express.js",
    category: "backend",
    proficiency: "88",
    icon: "⚡",
    color: "from-slate-400 to-slate-700",
    description: "RESTful architecture, custom middlewares, JWT authentication, CORS.",
    tag: "Advanced",
    order: 9,
  },
  {
    name: "MongoDB & Mongoose",
    category: "backend",
    proficiency: "86",
    icon: "🍃",
    color: "from-green-500 to-emerald-600",
    description: "Schema modeling, aggregation pipelines, indexing, CRUD pipelines.",
    tag: "Advanced",
    order: 10,
  },
  {
    name: "Firebase / Firestore",
    category: "backend",
    proficiency: "85",
    icon: "🔥",
    color: "from-amber-500 to-orange-600",
    description: "Firebase Auth, real-time database, cloud firestore, security rules.",
    tag: "Proficient",
    order: 11,
  },
  {
    name: "REST API Integration",
    category: "backend",
    proficiency: "92",
    icon: "🔗",
    color: "from-indigo-500 to-blue-600",
    description: "Secure endpoints, pagination, token auth, error handling standard.",
    tag: "Advanced",
    order: 12,
  },
  // Tools & DevOps
  {
    name: "Git & GitHub",
    category: "tools",
    proficiency: "92",
    icon: "🐙",
    color: "from-purple-500 to-indigo-600",
    description: "Branching strategies, pull requests, merge conflict resolution.",
    tag: "Advanced",
    order: 13,
  },
  {
    name: "Vercel / Cloud Deployment",
    category: "tools",
    proficiency: "90",
    icon: "🌐",
    color: "from-blue-400 to-cyan-500",
    description: "Automated CI/CD pipelines, custom domains, environment variables.",
    tag: "Advanced",
    order: 14,
  },
  {
    name: "Figma to Code",
    category: "tools",
    proficiency: "95",
    icon: "📐",
    color: "from-pink-500 to-rose-500",
    description: "Pixel-perfect conversion of complex design systems into React code.",
    tag: "Expert",
    order: 15,
  },
  {
    name: "Postman & API Testing",
    category: "tools",
    proficiency: "88",
    icon: "📬",
    color: "from-orange-500 to-amber-600",
    description: "Endpoint validation, header config, automated payload testing.",
    tag: "Advanced",
    order: 16,
  },
];

async function migrateAndSeed() {
  try {
    console.log("1. Adding missing columns...");
    await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS description TEXT;`;
    await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS tag VARCHAR(50);`;
    await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS color VARCHAR(100);`;
    console.log("✓ Columns added successfully!");

    console.log("2. Clearing old skills and inserting 16 verified skills...");
    await sql`DELETE FROM skills;`;

    for (const item of DEFAULT_SKILLS) {
      await sql`
        INSERT INTO skills (name, category, proficiency, icon, description, tag, color, "order")
        VALUES (${item.name}, ${item.category}, ${item.proficiency}, ${item.icon}, ${item.description}, ${item.tag}, ${item.color}, ${item.order});
      `;
    }

    const count = await sql`SELECT count(*) FROM skills;`;
    console.log("✓ Skills inserted! Total count now in Neon DB:", count[0].count);
  } catch (err) {
    console.error("Migration Error:", err);
  }
}

migrateAndSeed();
