import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/lib/db";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    // 1. Try to fetch the latest uploaded PDF from Neon PostgreSQL
    let rows: any[] = [];
    try {
      rows = await sql`
        SELECT filename, mime_type, file_data, file_size, updated_at
        FROM cv_storage
        WHERE id = 1
        LIMIT 1;
      `;
    } catch (dbErr) {
      console.warn("Could not query cv_storage, falling back to disk:", dbErr);
    }

    if (rows.length > 0 && rows[0].file_data) {
      const fileBuffer = Buffer.from(rows[0].file_data, "base64");
      const filename = rows[0].filename || "Md_Moniruzzaman_Resume.pdf";
      const isDownload = req.nextUrl.searchParams.get("download") === "true";

      return new Response(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": rows[0].mime_type || "application/pdf",
          "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="${filename}"`,
          "Content-Length": String(fileBuffer.length),
          "Cache-Control": "public, max-age=120, s-maxage=120",
        },
      });
    }

    // 2. Fallback to physical static file in public/ if database row is empty
    try {
      const filePath = path.join(process.cwd(), "public", "resume.pdf");
      const staticBuffer = await readFile(filePath);
      return new Response(staticBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="Md_Moniruzzaman_Resume.pdf"',
          "Content-Length": String(staticBuffer.length),
          "Cache-Control": "public, max-age=120, s-maxage=120",
        },
      });
    } catch (fsErr) {
      console.warn("No static resume.pdf fallback found on disk.");
    }

    return new Response(
      JSON.stringify({ error: "No resume PDF file has been uploaded yet." }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Failed to download CV:", error);
    return new Response(
      JSON.stringify({ error: "Failed to download CV", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
