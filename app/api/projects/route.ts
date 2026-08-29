import { getAllTheProjects } from "@/app/Actions/Skill/GetSkills";
import { NextRequest } from "next/server";
import sql from "@/app/lib/db";

export async function GET() {
  const projects = await getAllTheProjects();
  return new Response(JSON.stringify(projects), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const isFeatured = Boolean(body.is_featured || body.isFeatured || body.isPinned);

    const result = await sql`
      INSERT INTO projects (
        title,
        description,
        tech,
        img,
        images,
        live_url,
        github_url,
        category,
        challenges_solutions,
        estimate_time,
        is_featured
      )
      VALUES (
        ${body.title || ""},
        ${body.description || body.desc || ""},
        ${body.tech || ""},
        ${body.img || ""},
        ${JSON.stringify(body.images || [])}::jsonb,
        ${body.liveUrl || body.live || ""},
        ${body.githubUrl || body.github || ""},
        ${body.category || "custom"},
        ${body.challengesSolutions || ""},
        ${body.estimateTime || ""},
        ${isFeatured}
      )
      RETURNING id, title, is_featured, created_at;
    `;

    return new Response(
      JSON.stringify({
        success: true,
        _id: String(result[0].id),
        is_featured: result[0].is_featured,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to create project in Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to create project" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
