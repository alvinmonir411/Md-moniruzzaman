import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-flash-latest",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
];

interface CodebaseInfo {
  repoName: string;
  pkgName?: string;
  pkgDescription?: string;
  dependencies?: string[];
  readmeContent?: string;
  githubApiData?: any;
}

// Inspect GitHub codebase: README.md, package.json, and repo metadata
async function inspectGitHubCodebase(urlOrName: string): Promise<CodebaseInfo | null> {
  try {
    let owner = "alvinmonir411";
    let repo = urlOrName.trim();

    if (urlOrName.includes("github.com/")) {
      const parts = urlOrName.replace(/^https?:\/\/github\.com\//i, "").replace(/\/$/, "").split("/");
      if (parts.length >= 2) {
        owner = parts[0];
        repo = parts[1];
      } else if (parts.length === 1) {
        repo = parts[0];
      }
    }

    repo = repo.replace(/[^a-zA-Z0-9._-]/g, "");
    if (!repo) return null;

    let pkg: any = null;
    let readme = "";

    // 1. Fetch package.json from main or master branch
    for (const branch of ["main", "master"]) {
      if (!pkg) {
        try {
          const pkgRes = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/package.json`,
            { headers: { "User-Agent": "Portfolio-App" }, next: { revalidate: 60 } }
          );
          if (pkgRes.ok) {
            pkg = await pkgRes.json();
          }
        } catch (e) {
          // ignore
        }
      }

      // 2. Fetch README.md
      if (!readme) {
        try {
          const readmeRes = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`,
            { headers: { "User-Agent": "Portfolio-App" }, next: { revalidate: 60 } }
          );
          if (readmeRes.ok) {
            readme = await readmeRes.text();
          }
        } catch (e) {
          // ignore
        }
      }
    }

    // 3. Fetch repo metadata from GitHub API
    let githubApiData: any = null;
    try {
      const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { "User-Agent": "Portfolio-App", Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 60 },
      });
      if (apiRes.ok) {
        githubApiData = await apiRes.json();
      }
    } catch (e) {
      // ignore
    }

    const dependencies = pkg?.dependencies ? Object.keys(pkg.dependencies) : [];

    return {
      repoName: repo,
      pkgName: pkg?.name,
      pkgDescription: pkg?.description,
      dependencies,
      readmeContent: readme ? readme.slice(0, 3000) : "",
      githubApiData,
    };
  } catch (err) {
    console.warn("Could not inspect GitHub codebase:", err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, prompt, githubUrl, liveUrl, tech } = await request.json();

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_API_SERECT ||
      "";

    // 1. Deep Codebase Inspection if GitHub URL or title/repo is provided
    let codebaseContext = "";
    const repoIdentifier = githubUrl || title || prompt;
    const codebase = await inspectGitHubCodebase(repoIdentifier);

    if (codebase) {
      codebaseContext = `
REAL GITHUB CODEBASE INSPECTION REPORT:
- Repository Name: ${codebase.repoName}
- package.json Name: ${codebase.pkgName || "N/A"}
- package.json Description: ${codebase.pkgDescription || "N/A"}
- Detected Dependencies: ${codebase.dependencies?.length ? codebase.dependencies.join(", ") : "N/A"}
- GitHub Official Description: ${codebase.githubApiData?.description || "N/A"}
- GitHub Primary Language & Topics: ${codebase.githubApiData?.language || "N/A"}, Topics: ${codebase.githubApiData?.topics?.join(", ") || "None"}
- README Excerpt:
"""
${codebase.readmeContent || "No README found."}
"""
`;
    }

    const systemPrompt = `
You are a world-class tech portfolio copywriter and senior software architect.
Your mission is to write an executive, stunning, and accurate portfolio entry based on the actual codebase details.

${codebaseContext ? codebaseContext : `Input Context:\n- Project Name/Keywords: ${title || prompt || "Web Application"}\n- GitHub URL: ${githubUrl || "N/A"}\n- Live Demo: ${liveUrl || "N/A"}\n- Tech Hint: ${tech || "React, Next.js"}`}

INSTRUCTIONS:
1. Title: Create a clean, catchy, executive title with a descriptive tagline (e.g. "Murtec — Multi-Trade Platform & Operations Hub" or "Security Desk — Modular School ERP Monolith").
2. Description: Write the best 2-3 sentence project description summarizing what the application actually does based on the real codebase, its architecture, key user features, and performance benefits. Make it sound extremely professional and impressive.
3. Tech: Provide a clean, comma-separated list of genuine technologies detected from the dependencies and code (e.g. Next.js 16, NestJS, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Cloudinary, etc.).
4. Challenges & Solutions: A crisp 1-2 sentence highlight of key architectural solution (e.g. "Engineered modular monolithic architecture with role-based access control and real-time database syncing.").

CRITICAL: Return ONLY valid, raw JSON (no markdown fences, no \`\`\`json wrappers) matching this schema:
{
  "title": "...",
  "description": "...",
  "tech": "...",
  "challengesSolutions": "...",
  "category": "custom"
}
`;

    let generatedData = null;

    if (apiKey) {
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
                maxOutputTokens: 800,
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
            if (generatedData?.title && generatedData?.description) {
              break;
            }
          }
        } catch (err) {
          console.warn(`Model ${model} failed, trying next fallback...`);
        }
      }
    }

    if (!generatedData) {
      // Smart Fallback using inspected codebase
      const cleanName = (codebase?.repoName || title || "Modern Web Application")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());

      const detectedTechList = codebase?.dependencies?.length
        ? codebase.dependencies
            .filter((d) => !d.startsWith("@types/"))
            .slice(0, 6)
            .map((d) => d.replace(/@neondatabase\/serverless/g, "Neon PostgreSQL").replace(/@reduxjs\/toolkit/g, "Redux Toolkit"))
            .join(", ")
        : tech || "Next.js 16, TypeScript, Tailwind CSS, PostgreSQL, REST API";

      const smartDesc = codebase?.pkgDescription
        ? `${codebase.pkgDescription}. Built with modern full-stack architecture, high performance, and responsive UI.`
        : codebase?.githubApiData?.description
        ? `${codebase.githubApiData.description}. Engineered with modular architecture and seamless user experience.`
        : `A scalable, production-grade web application built with clean architecture, responsive design, and seamless performance.`;

      generatedData = {
        title: `${cleanName} — High-Performance Platform`,
        description: smartDesc,
        tech: detectedTechList,
        challengesSolutions: "Optimized component rendering, state management, and real-time data persistence.",
        category: "custom",
      };
    }

    return NextResponse.json({
      success: true,
      data: generatedData,
      inspectedCodebase: Boolean(codebase),
    });
  } catch (error: any) {
    console.error("AI Project Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate project details with AI" },
      { status: 500 }
    );
  }
}
