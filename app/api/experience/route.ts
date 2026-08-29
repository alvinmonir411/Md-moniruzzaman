import { NextRequest } from "next/server";
import sql from "@/app/lib/db";

export async function GET() {
  try {
    const experiences = await sql`
      SELECT 
        id as _id,
        role as position,
        company,
        timeline,
        location,
        tag,
        highlights,
        created_at as "createdAt"
      FROM experience
      ORDER BY id DESC;
    `;

    const serializableExperiences = experiences.map((exp: any) => ({
      ...exp,
      _id: String(exp._id),
      createdAt: exp.createdAt ? new Date(exp.createdAt).toISOString() : new Date().toISOString(),
    }));

    return new Response(JSON.stringify(serializableExperiences), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch experiences from Neon DB:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch experiences" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await sql`
      INSERT INTO experience (
        role,
        company,
        timeline,
        location,
        tag,
        highlights
      )
      VALUES (
        ${body.position || body.role || ""},
        ${body.company || ""},
        ${body.timeline || ""},
        ${body.location || ""},
        ${body.tag || ""},
        ${JSON.stringify(body.highlights || body.technologies || [])}::jsonb
      )
      RETURNING id, role, company, created_at;
    `;

    return new Response(
      JSON.stringify({
        success: true,
        _id: String(result[0].id),
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to create experience in Neon DB:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create experience" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body._id);

    const result = await sql`
      UPDATE experience
      SET 
        role = COALESCE(${body.position || body.role}, role),
        company = COALESCE(${body.company}, company),
        timeline = COALESCE(${body.timeline}, timeline),
        location = COALESCE(${body.location}, location),
        tag = COALESCE(${body.tag}, tag),
        highlights = COALESCE(${body.highlights ? JSON.stringify(body.highlights) : null}::jsonb, highlights)
      WHERE id = ${id}
      RETURNING id;
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Experience not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update experience in Neon DB:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update experience" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Experience ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await sql`
      DELETE FROM experience
      WHERE id = ${Number(id)}
      RETURNING id;
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Experience not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to delete experience from Neon DB:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete experience" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
