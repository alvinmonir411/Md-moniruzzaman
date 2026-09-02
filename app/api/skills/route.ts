import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/lib/db";

const DEFAULT_SKILLS = [
  // Frontend
  {
    name: "React.js",
    category: "frontend",
    proficiency: 95,
    icon: "⚛️",
    color: "from-cyan-500 to-blue-500",
    description: "Custom hooks, Context API, state optimization, concurrent mode.",
    tag: "Expert",
    order: 1,
  },
  {
    name: "Next.js (App Router)",
    category: "frontend",
    proficiency: 92,
    icon: "🚀",
    color: "from-slate-300 to-slate-600",
    description: "SSR, SSG, Server Actions, route handlers, dynamic SEO optimization.",
    tag: "Advanced",
    order: 2,
  },
  {
    name: "TypeScript",
    category: "frontend",
    proficiency: 90,
    icon: "🟦",
    color: "from-blue-500 to-indigo-600",
    description: "Generics, strict typing, interfaces, utility types, clean schemas.",
    tag: "Advanced",
    order: 3,
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    proficiency: 98,
    icon: "💨",
    color: "from-teal-400 to-cyan-500",
    description: "Responsive layouts, custom utilities, modern dark/light theming.",
    tag: "Master",
    order: 4,
  },
  {
    name: "Redux Toolkit / Zustand",
    category: "frontend",
    proficiency: 88,
    icon: "🔴",
    color: "from-purple-500 to-pink-500",
    description: "Global state management, slices, async thunks, persistence.",
    tag: "Advanced",
    order: 5,
  },
  {
    name: "JavaScript (ES6+)",
    category: "frontend",
    proficiency: 95,
    icon: "⚡",
    color: "from-yellow-400 to-amber-500",
    description: "Async/await, closures, prototypes, event loops, DOM manipulation.",
    tag: "Expert",
    order: 6,
  },
  {
    name: "HTML5 & CSS3 Animations",
    category: "frontend",
    proficiency: 96,
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
    proficiency: 85,
    icon: "🟢",
    color: "from-emerald-500 to-green-600",
    description: "Event-driven runtime, asynchronous architecture, backend APIs.",
    tag: "Proficient",
    order: 8,
  },
  {
    name: "Express.js",
    category: "backend",
    proficiency: 88,
    icon: "⚡",
    color: "from-slate-400 to-slate-700",
    description: "RESTful architecture, custom middlewares, JWT authentication, CORS.",
    tag: "Advanced",
    order: 9,
  },
  {
    name: "MongoDB & Mongoose",
    category: "backend",
    proficiency: 86,
    icon: "🍃",
    color: "from-green-500 to-emerald-600",
    description: "Schema modeling, aggregation pipelines, indexing, CRUD pipelines.",
    tag: "Advanced",
    order: 10,
  },
  {
    name: "Firebase / Firestore",
    category: "backend",
    proficiency: 85,
    icon: "🔥",
    color: "from-amber-500 to-orange-600",
    description: "Firebase Auth, real-time database, cloud firestore, security rules.",
    tag: "Proficient",
    order: 11,
  },
  {
    name: "REST API Integration",
    category: "backend",
    proficiency: 92,
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
    proficiency: 92,
    icon: "🐙",
    color: "from-purple-500 to-indigo-600",
    description: "Branching strategies, pull requests, merge conflict resolution.",
    tag: "Advanced",
    order: 13,
  },
  {
    name: "Vercel / Cloud Deployment",
    category: "tools",
    proficiency: 90,
    icon: "🌐",
    color: "from-blue-400 to-cyan-500",
    description: "Automated CI/CD pipelines, custom domains, environment variables.",
    tag: "Advanced",
    order: 14,
  },
  {
    name: "Figma to Code",
    category: "tools",
    proficiency: 95,
    icon: "📐",
    color: "from-pink-500 to-rose-500",
    description: "Pixel-perfect conversion of complex design systems into React code.",
    tag: "Expert",
    order: 15,
  },
  {
    name: "Postman & API Testing",
    category: "tools",
    proficiency: 88,
    icon: "📬",
    color: "from-orange-500 to-amber-600",
    description: "Endpoint validation, header config, automated payload testing.",
    tag: "Advanced",
    order: 16,
  },
];

export async function GET() {
  try {
    let skills = await sql`
      SELECT 
        id as _id,
        name,
        category,
        proficiency,
        icon,
        description,
        tag,
        color,
        "order",
        created_at as "createdAt"
      FROM skills
      ORDER BY "order" ASC, id ASC;
    `;

    // Auto-seed if table is empty
    if (skills.length === 0) {
      for (const item of DEFAULT_SKILLS) {
        await sql`
          INSERT INTO skills (name, category, proficiency, icon, description, tag, color, "order")
          VALUES (${item.name}, ${item.category}, ${String(item.proficiency)}, ${item.icon}, ${item.description}, ${item.tag}, ${item.color}, ${item.order});
        `;
      }

      skills = await sql`
        SELECT 
          id as _id,
          name,
          category,
          proficiency,
          icon,
          description,
          tag,
          color,
          "order",
          created_at as "createdAt"
        FROM skills
        ORDER BY "order" ASC, id ASC;
      `;
    }

    const serializableSkills = skills.map((skill: any) => ({
      ...skill,
      _id: String(skill._id),
      proficiency: Number(skill.proficiency) || 50,
      category: (skill.category || "frontend").toLowerCase(),
      createdAt: skill.createdAt ? new Date(skill.createdAt).toISOString() : undefined,
    }));

    return NextResponse.json(serializableSkills, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch skills from Neon DB:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shouldSeed = searchParams.get("seed") === "true";

    if (shouldSeed) {
      // Clear existing and re-seed defaults
      await sql`DELETE FROM skills;`;
      for (const item of DEFAULT_SKILLS) {
        await sql`
          INSERT INTO skills (name, category, proficiency, icon, description, tag, color, "order")
          VALUES (${item.name}, ${item.category}, ${String(item.proficiency)}, ${item.icon}, ${item.description}, ${item.tag}, ${item.color}, ${item.order});
        `;
      }
      return NextResponse.json({ success: true, message: "Skills seeded successfully" });
    }

    const body = await request.json();

    const normalizedCategory = (body.category || "frontend").toLowerCase().includes("back")
      ? "backend"
      : (body.category || "frontend").toLowerCase().includes("tool")
      ? "tools"
      : "frontend";

    const result = await sql`
      INSERT INTO skills (name, category, proficiency, icon, description, tag, color, "order")
      VALUES (
        ${body.name},
        ${normalizedCategory},
        ${String(body.proficiency || 50)},
        ${body.icon || "⚡"},
        ${body.description || ""},
        ${body.tag || "Advanced"},
        ${body.color || "from-indigo-500 to-purple-500"},
        ${body.order || 0}
      )
      RETURNING id, name, created_at;
    `;

    return NextResponse.json(
      {
        success: true,
        _id: String(result[0].id),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create skill in Neon DB:", error);
    return NextResponse.json({ error: error.message || "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body._id || body.id);

    const normalizedCategory = (body.category || "frontend").toLowerCase().includes("back")
      ? "backend"
      : (body.category || "frontend").toLowerCase().includes("tool")
      ? "tools"
      : "frontend";

    const result = await sql`
      UPDATE skills
      SET 
        name = COALESCE(${body.name}, name),
        category = ${normalizedCategory},
        proficiency = COALESCE(${String(body.proficiency)}, proficiency),
        icon = COALESCE(${body.icon}, icon),
        description = COALESCE(${body.description}, description),
        tag = COALESCE(${body.tag}, tag),
        color = COALESCE(${body.color}, color),
        "order" = COALESCE(${body.order}, "order")
      WHERE id = ${id}
      RETURNING id;
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update skill in Neon DB:", error);
    return NextResponse.json({ error: error.message || "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Skill ID required" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM skills
      WHERE id = ${Number(id)}
      RETURNING id;
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to delete skill from Neon DB:", error);
    return NextResponse.json({ error: error.message || "Failed to delete skill" }, { status: 500 });
  }
}
