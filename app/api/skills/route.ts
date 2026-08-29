import { NextRequest } from "next/server";
import sql from "@/app/lib/db";

export async function GET() {
  try {
    const skills = await sql`
      SELECT 
        id as _id,
        name,
        category,
        proficiency,
        icon,
        "order",
        created_at as "createdAt"
      FROM skills
      ORDER BY "order" ASC, id ASC;
    `;

    const serializableSkills = skills.map((skill: any) => ({
      ...skill,
      _id: String(skill._id),
      createdAt: skill.createdAt ? new Date(skill.createdAt).toISOString() : undefined,
    }));

    return new Response(JSON.stringify(serializableSkills), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch skills from Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch skills" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await sql`
      INSERT INTO skills (name, category, proficiency, icon, "order")
      VALUES (${body.name}, ${body.category}, ${body.proficiency}, ${body.icon || ""}, ${body.order || 0})
      RETURNING id, name, created_at;
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
    console.error("Failed to create skill in Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to create skill" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Number(body._id);

    const result = await sql`
      UPDATE skills
      SET 
        name = COALESCE(${body.name}, name),
        category = COALESCE(${body.category}, category),
        proficiency = COALESCE(${body.proficiency}, proficiency),
        icon = COALESCE(${body.icon}, icon),
        "order" = COALESCE(${body.order}, "order")
      WHERE id = ${id}
      RETURNING id;
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Skill not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update skill in Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to update skill" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Skill ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await sql`
      DELETE FROM skills
      WHERE id = ${Number(id)}
      RETURNING id;
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Skill not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to delete skill from Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to delete skill" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
