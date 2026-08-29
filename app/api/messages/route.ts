import { NextRequest } from "next/server";
import sql from "@/app/lib/db";

export async function GET() {
  try {
    const messages = await sql`
      SELECT 
        id as _id,
        name,
        email,
        subject,
        message,
        is_read as "isRead",
        created_at as "createdAt"
      FROM messages
      ORDER BY id DESC;
    `;

    const serializableMessages = messages.map((msg: any) => ({
      ...msg,
      _id: String(msg._id),
      createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : new Date().toISOString(),
    }));

    return new Response(JSON.stringify(serializableMessages), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch messages from Neon DB:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch messages" }),
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
      INSERT INTO messages (name, email, subject, message, is_read)
      VALUES (${body.name || ""}, ${body.email || ""}, ${body.subject || ""}, ${body.message || ""}, false)
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
    console.error("Failed to create message in Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to create message" }), {
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
      UPDATE messages
      SET 
        is_read = COALESCE(${body.isRead}, is_read)
      WHERE id = ${id}
      RETURNING id;
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Message not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update message in Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to update message" }), {
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
      return new Response(JSON.stringify({ error: "Message ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await sql`
      DELETE FROM messages
      WHERE id = ${Number(id)}
      RETURNING id;
    `;

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "Message not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to delete message from Neon DB:", error);
    return new Response(JSON.stringify({ error: "Failed to delete message" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
