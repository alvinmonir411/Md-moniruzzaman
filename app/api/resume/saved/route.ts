import { NextRequest, NextResponse } from "next/server";
import sql, { initDatabase } from "@/app/lib/db";

export async function GET() {
  try {
    await initDatabase();
    const rows = await sql`
      SELECT 
        id,
        job_title,
        company_name,
        job_description,
        resume_data,
        created_at,
        updated_at
      FROM saved_resumes
      ORDER BY id DESC;
    `;
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("Failed to fetch saved resumes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();
    const { jobTitle, companyName, jobDescription, resumeData } = body;

    if (!jobTitle || !resumeData) {
      return NextResponse.json(
        { error: "jobTitle and resumeData are required" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO saved_resumes (
        job_title,
        company_name,
        job_description,
        resume_data
      ) VALUES (
        ${jobTitle},
        ${companyName || ""},
        ${jobDescription || ""},
        ${JSON.stringify(resumeData)}::jsonb
      )
      RETURNING id, job_title, company_name, created_at;
    `;

    return NextResponse.json({ success: true, saved: result[0] });
  } catch (error: any) {
    console.error("Failed to save resume:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await sql`
      DELETE FROM saved_resumes WHERE id = ${Number(id)};
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete saved resume:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
