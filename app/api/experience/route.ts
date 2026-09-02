import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/lib/db";

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

export async function GET() {
  try {
    let experiences = await sql`
      SELECT 
        id as _id,
        COALESCE(type, 'experience') as type,
        role as position,
        role,
        company,
        timeline,
        location,
        tag,
        icon,
        is_live as "isLive",
        details,
        highlights,
        created_at as "createdAt"
      FROM experience
      ORDER BY id ASC;
    `;

    // Auto-seed if table is empty
    if (experiences.length === 0) {
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

      experiences = await sql`
        SELECT 
          id as _id,
          COALESCE(type, 'experience') as type,
          role as position,
          role,
          company,
          timeline,
          location,
          tag,
          icon,
          is_live as "isLive",
          details,
          highlights,
          created_at as "createdAt"
        FROM experience
        ORDER BY id ASC;
      `;
    }

    const serializable = experiences.map((exp: any) => ({
      ...exp,
      _id: String(exp._id),
      type: exp.type || "experience",
      isLive: Boolean(exp.isLive),
      highlights: Array.isArray(exp.highlights) ? exp.highlights : [],
      createdAt: exp.createdAt ? new Date(exp.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(serializable, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch experiences from Neon DB:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch experiences" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shouldSeed = searchParams.get("seed") === "true";

    if (shouldSeed) {
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
      return NextResponse.json({ success: true, message: "Experiences seeded successfully" });
    }

    const body = await request.json();

    const result = await sql`
      INSERT INTO experience (
        type,
        role,
        company,
        timeline,
        location,
        tag,
        icon,
        is_live,
        details,
        highlights
      )
      VALUES (
        ${body.type || "experience"},
        ${body.position || body.role || ""},
        ${body.company || ""},
        ${body.timeline || ""},
        ${body.location || ""},
        ${body.tag || ""},
        ${body.icon || (body.type === "education" ? "🎓" : "💼")},
        ${Boolean(body.isLive)},
        ${body.details || ""},
        ${JSON.stringify(Array.isArray(body.highlights) ? body.highlights : body.technologies || [])}::jsonb
      )
      RETURNING id, role, company, created_at;
    `;

    return NextResponse.json(
      {
        success: true,
        _id: String(result[0].id),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Failed to create experience in Neon DB:", error);
    return NextResponse.json({ error: error.message || "Failed to create experience" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body._id || body.id);

    const result = await sql`
      UPDATE experience
      SET 
        type = COALESCE(${body.type}, type),
        role = COALESCE(${body.position || body.role}, role),
        company = COALESCE(${body.company}, company),
        timeline = COALESCE(${body.timeline}, timeline),
        location = COALESCE(${body.location}, location),
        tag = COALESCE(${body.tag}, tag),
        icon = COALESCE(${body.icon}, icon),
        is_live = COALESCE(${body.isLive !== undefined ? Boolean(body.isLive) : null}, is_live),
        details = COALESCE(${body.details}, details),
        highlights = COALESCE(${body.highlights ? JSON.stringify(body.highlights) : null}::jsonb, highlights)
      WHERE id = ${id}
      RETURNING id;
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update experience in Neon DB:", error);
    return NextResponse.json({ error: error.message || "Failed to update experience" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Experience ID required" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM experience
      WHERE id = ${Number(id)}
      RETURNING id;
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to delete experience from Neon DB:", error);
    return NextResponse.json({ error: error.message || "Failed to delete experience" }, { status: 500 });
  }
}
