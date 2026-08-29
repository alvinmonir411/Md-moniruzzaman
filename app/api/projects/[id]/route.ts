import { NextRequest } from "next/server";
import sql from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const result = await sql`
      SELECT 
        id as _id,
        title,
        description,
        tech,
        img,
        images,
        live_url as "liveUrl",
        github_url as "githubUrl",
        category,
        challenges_solutions as "challengesSolutions",
        estimate_time as "estimateTime",
        is_featured as "isFeatured",
        created_at as "createdAt"
      FROM projects 
      WHERE id = ${Number(params.id)}
      LIMIT 1;
    `;

    if (!result || result.length === 0) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const project = result[0];

    return new Response(
      JSON.stringify({
        ...project,
        _id: String(project._id),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to fetch project from Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch project" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const body = await request.json();
    const id = Number(params.id);

    await sql`
      UPDATE projects
      SET 
        title = COALESCE(${body.title}, title),
        description = COALESCE(${body.description || body.desc}, description),
        tech = COALESCE(${body.tech}, tech),
        img = COALESCE(${body.img}, img),
        images = COALESCE(${body.images ? JSON.stringify(body.images) : null}::jsonb, images),
        live_url = COALESCE(${body.liveUrl || body.live}, live_url),
        github_url = COALESCE(${body.githubUrl || body.github}, github_url),
        category = COALESCE(${body.category}, category),
        is_featured = COALESCE(${body.is_featured ?? body.isFeatured ?? body.isPinned}, is_featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update project in Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to update project" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = Number(params.id);

    const result = await sql`
      DELETE FROM projects
      WHERE id = ${id}
      RETURNING id;
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to delete project from Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to delete project" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
