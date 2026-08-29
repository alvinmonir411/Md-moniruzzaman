import { NextRequest } from "next/server";
import sql from "@/app/lib/db";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return new Response(JSON.stringify({ views: 1 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id INT PRIMARY KEY DEFAULT 1,
        view_count INT DEFAULT 1,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const result = await sql`
      SELECT view_count FROM page_views WHERE id = 1 LIMIT 1;
    `;

    const views = result.length > 0 ? result[0].view_count : 1;

    return new Response(JSON.stringify({ views }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch views from Neon DB:", error);
    return new Response(JSON.stringify({ views: 1 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return new Response(JSON.stringify({ views: 1 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id INT PRIMARY KEY DEFAULT 1,
        view_count INT DEFAULT 1,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Upsert and increment view count
    const result = await sql`
      INSERT INTO page_views (id, view_count, updated_at)
      VALUES (1, 1, CURRENT_TIMESTAMP)
      ON CONFLICT (id) 
      DO UPDATE SET 
        view_count = page_views.view_count + 1,
        updated_at = CURRENT_TIMESTAMP
      RETURNING view_count;
    `;

    const views = result.length > 0 ? result[0].view_count : 1;

    return new Response(JSON.stringify({ success: true, views }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to increment views in Neon DB:", error);
    return new Response(JSON.stringify({ success: false, views: 1 }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
