import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash",
];

export async function POST(request: NextRequest) {
  try {
    const { title, prompt, githubUrl, liveUrl, tech } = await request.json();

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_API_SERECT ||
      "";

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Gemini API Key is not configured in .env.local",
        },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are an expert tech portfolio copywriter for a high-performing Full-Stack & Front-End Developer.
Generate a professional, high-impact Title, crisp 2-3 sentence Description, and relevant Tech Stack for a portfolio project.

Input details:
- Project Name/Keywords: ${title || prompt || "Web Application"}
- GitHub URL: ${githubUrl || "N/A"}
- Live Demo: ${liveUrl || "N/A"}
- Tech hint: ${tech || "React, Next.js"}

CRITICAL: Return ONLY valid, raw JSON (no markdown fences, no \`\`\`json wrappers) matching this schema:
{
  "title": "Clean, catchy, professional title (e.g. Murtec — Modern Cloud & Tech Platform)",
  "description": "Engaging 2-3 sentence description highlighting business impact, architecture, and user experience.",
  "tech": "Comma-separated tech stack list (e.g. Next.js 16, TypeScript, Tailwind CSS, PostgreSQL, Neon DB)",
  "category": "custom"
}
`;

    let generatedData = null;

    for (const model of GEMINI_MODELS) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: systemPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600,
            },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
          
          // Clean possible markdown code fences
          const cleanedJson = rawText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

          generatedData = JSON.parse(cleanedJson);
          break;
        }
      } catch (err) {
        console.warn(`Model ${model} failed, trying next fallback...`);
      }
    }

    if (!generatedData) {
      // Smart Fallback
      const baseTitle = (title || "Modern Web Application")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());

      generatedData = {
        title: `${baseTitle} — High-Performance Platform`,
        description: `A scalable, production-grade web application built with clean architecture, responsive design, and seamless performance across desktop, tablet, and mobile devices.`,
        tech: tech || "Next.js 16, TypeScript, Tailwind CSS, PostgreSQL, REST API",
        category: "custom",
      };
    }

    return NextResponse.json({
      success: true,
      data: generatedData,
    });
  } catch (error: any) {
    console.error("AI Project Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate project details with AI" },
      { status: 500 }
    );
  }
}
