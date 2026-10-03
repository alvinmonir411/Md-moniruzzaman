import { NextRequest, NextResponse } from "next/server";
import sql, { initDatabase } from "@/app/lib/db";
import { writeFile, stat } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    await initDatabase();

    // 1. Check Neon PostgreSQL database first
    const rows = await sql`
      SELECT filename, file_size, updated_at
      FROM cv_storage
      WHERE id = 1
      LIMIT 1;
    `;

    if (rows.length > 0 && rows[0].file_size) {
      return NextResponse.json({
        exists: true,
        size: rows[0].file_size,
        filename: rows[0].filename,
        updatedAt: rows[0].updated_at
          ? new Date(rows[0].updated_at).toISOString()
          : new Date().toISOString(),
        url: "/api/resume/download",
      });
    }

    // 2. Fallback to checking public/resume.pdf on local disk
    try {
      const filePath = path.join(process.cwd(), "public", "resume.pdf");
      const fileStat = await stat(filePath);

      return NextResponse.json({
        exists: true,
        size: fileStat.size,
        filename: "resume.pdf",
        updatedAt: fileStat.mtime.toISOString(),
        url: "/api/resume/download",
      });
    } catch {
      // No local file
    }

    return NextResponse.json({
      exists: false,
      url: "/api/resume/download",
    });
  } catch (error: any) {
    console.error("Failed to check CV status:", error);
    return NextResponse.json({
      exists: false,
      url: "/api/resume/download",
      error: error.message,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();

    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "No PDF file provided. Please choose a file to upload." },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF (.pdf) files are allowed." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");
    const filename = file.name || "Md_Moniruzzaman_Resume.pdf";
    const mimeType = file.type || "application/pdf";

    // 1. Permanently store in Neon PostgreSQL (Works on Vercel Serverless!)
    await sql`
      INSERT INTO cv_storage (
        id,
        filename,
        mime_type,
        file_data,
        file_size,
        updated_at
      )
      VALUES (
        1,
        ${filename},
        ${mimeType},
        ${base64Data},
        ${buffer.length},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        filename = EXCLUDED.filename,
        mime_type = EXCLUDED.mime_type,
        file_data = EXCLUDED.file_data,
        file_size = EXCLUDED.file_size,
        updated_at = CURRENT_TIMESTAMP;
    `;

    // 2. Best-effort write to local disk if filesystem is writable (Development environment)
    try {
      const targetPath = path.join(process.cwd(), "public", "resume.pdf");
      await writeFile(targetPath, buffer);
    } catch (fsWriteErr) {
      // Expected on Vercel Serverless environment where disk is read-only
      console.info("Disk write bypassed on read-only serverless environment.");
    }

    return NextResponse.json({
      success: true,
      message: "CV uploaded and updated successfully! Live on your portfolio.",
      url: "/api/resume/download",
      filename,
      size: buffer.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Failed to upload resume to database:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload resume file to database" },
      { status: 500 }
    );
  }
}
