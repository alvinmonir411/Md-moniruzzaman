import { NextRequest } from "next/server";
import { writeFile, stat } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "resume.pdf");
    const fileStat = await stat(filePath);

    return new Response(
      JSON.stringify({
        exists: true,
        size: fileStat.size,
        updatedAt: fileStat.mtime.toISOString(),
        url: "/resume.pdf",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        exists: false,
        url: "/resume.pdf",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file || file.size === 0) {
      return new Response(JSON.stringify({ error: "No PDF file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return new Response(JSON.stringify({ error: "Only PDF files are allowed" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const targetPath = path.join(process.cwd(), "public", "resume.pdf");

    await writeFile(targetPath, buffer);

    return new Response(
      JSON.stringify({
        success: true,
        message: "CV uploaded and updated successfully!",
        url: "/resume.pdf",
        updatedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to upload resume:", error);
    return new Response(JSON.stringify({ error: "Failed to upload resume file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
