import { NextRequest, NextResponse } from "next/server";
import sql, { initDatabase } from "@/app/lib/db";
import { ATSResumeData } from "@/app/types";
import {
  FULLSTACK_RESUME_TEMPLATE,
  WIX_FRONTEND_RESUME_TEMPLATE,
} from "@/app/lib/resumeTemplates";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

export async function POST(req: NextRequest) {
  try {
    await initDatabase();
    const body = await req.json();
    const {
      jobDescription,
      targetRole,
      includeExperience = "auto",
      templateType = "auto",
    } = body;

    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
      return NextResponse.json(
        { error: "Job description is required to generate a tailored ATS resume." },
        { status: 400 }
      );
    }

    // 1. Fetch available projects from Neon Postgres
    let dbProjects: any[] = [];
    try {
      dbProjects = await sql`
        SELECT 
          id,
          title,
          description,
          tech,
          live_url,
          github_url,
          category,
          challenges_solutions
        FROM projects
        ORDER BY id DESC;
      `;
    } catch (dbErr) {
      console.warn("Could not query DB projects, using fallback:", dbErr);
    }

    // Include existing templates' projects if DB has few
    const candidateProjects = [
      ...dbProjects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        tech: p.tech,
        liveUrl: p.live_url || "",
        githubUrl: p.github_url || "",
        category: p.category || "custom",
      })),
      {
        title: "Property Management System — Next.js Full-Stack Application",
        description:
          "Real estate CRM with role-based dashboards, automated lead matching, and analytics.",
        tech: "Next.js, TypeScript, MongoDB, PostgreSQL, Tailwind CSS, React Hook Form, Framer Motion",
        liveUrl: "https://moniruzzaman-dev.vercel.app",
        githubUrl: "https://github.com/alvinmonir411",
        category: "custom",
      },
      {
        title: "Enterprise Distribution & Inventory ERP System (Full-Stack)",
        description:
          "Wholesale distribution, multi-channel order fulfillment, automated ledgers, and inventory tracking.",
        tech: "Next.js, React, TypeScript, NestJS, PostgreSQL, TypeORM, Socket.IO, Tailwind CSS, JWT",
        liveUrl: "https://moniruzzaman-dev.vercel.app",
        githubUrl: "https://github.com/alvinmonir411",
        category: "custom",
      },
      {
        title: "Linda's Cakes & Catering — E-Commerce & Booking Platform",
        description:
          "Wix CMS collections, multi-currency payment gateways, interactive ordering & tasting scheduling.",
        tech: "Wix Studio, Wix CMS, Wix Bookings, Wix Stores, Custom Velo/JavaScript",
        liveUrl: "https://moniruzzaman-dev.vercel.app",
        category: "wix",
      },
      {
        title: "Gamerz | Device Repair & Booking Platform",
        description:
          "Custom device repair booking workflow, automated RMA ticket generation, and real-time repair tracking.",
        tech: "Wix Studio, Wix CMS, Wix Bookings, Velo/JavaScript, Wix Data API, Backend Modules",
        liveUrl: "https://moniruzzaman-dev.vercel.app",
        category: "wix",
      },
    ];

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    // If no API key, return a smartly selected template
    if (!apiKey) {
      const isWix =
        jobDescription.toLowerCase().includes("wix") ||
        jobDescription.toLowerCase().includes("velo") ||
        templateType === "wix";
      return NextResponse.json({
        success: true,
        resume: isWix ? WIX_FRONTEND_RESUME_TEMPLATE : FULLSTACK_RESUME_TEMPLATE,
        isFallback: true,
        note: "Generated using static template (Gemini API key not detected).",
      });
    }

    const candidateProfile = {
      name: "Md Moniruzzaman",
      phone: "+8801979915165",
      email: "alvinmonir411@gmail.com",
      location: "Dhaka, Bangladesh (Open to Remote)",
      portfolioDisplay: "alvinmonir.vercel.app",
      portfolioUrl: "https://alvinmonir.vercel.app",
      githubDisplay: "github.com/alvinmonir411",
      githubUrl: "https://github.com/alvinmonir411",
      linkedinDisplay: "www.linkedin.com/in/moniruzzaman13663",
      linkedinUrl: "https://www.linkedin.com/in/moniruzzaman13663",
      education: {
        degree: "Bachelor of Social Science (BSS)",
        expectedYear: "Expected 2028",
        location: "Rangpur, Bangladesh",
      },
      languages: "Bengali: Native | English: Comfortable | Hindi: Fluent",
      experienceSM: {
        role: "Executive Front End",
        company: "SM Technology",
        duration: "1 year 1 month",
        description:
          "Developed and maintained custom Wix-based websites using Velo and Wix Studio. Collaborated with clients to translate business requirements into responsive, high-performance web solutions.",
      },
    };

    const promptText = `
You are an expert ATS (Applicant Tracking System) Resume Strategist.
Your goal is to tailor Md Moniruzzaman's resume for the provided Job Description (JD) while STRICTLY adhering to his standard 1-page ATS format.

CANDIDATE INFORMATION:
Name: ${candidateProfile.name}
Phone: ${candidateProfile.phone}
Email: ${candidateProfile.email}
Location: ${candidateProfile.location}
Portfolio: ${candidateProfile.portfolioDisplay} (${candidateProfile.portfolioUrl})
GitHub: ${candidateProfile.githubDisplay} (${candidateProfile.githubUrl})
LinkedIn: ${candidateProfile.linkedinDisplay} (${candidateProfile.linkedinUrl})
Education: ${candidateProfile.education.degree} ${candidateProfile.education.expectedYear} (${candidateProfile.education.location})
Languages: ${candidateProfile.languages}
Experience Option: Executive Front End | SM Technology (1 year 1 month)

CANDIDATE AVAILABLE PROJECTS FROM DATABASE:
${JSON.stringify(candidateProjects, null, 2)}

TARGET ROLE OVERRIDE: ${targetRole || "Auto-detect from Job Description"}
INCLUDE EXPERIENCE: ${includeExperience} (If "auto", include if the JD relates to Front-End / Wix / Web Developer where 1+ yr experience gives an edge; otherwise leave false to prioritize technical projects).

JOB DESCRIPTION TO TARGET:
\"\"\"
${jobDescription.trim()}
\"\"\"

STRICT RULES FOR OUTPUT:
1. TARGET TITLE: Set an accurate, professional title matching the JD (e.g. "Full-Stack Developer", "Front-End Developer", "React/Next.js Engineer", "Executive, Front End", or "Wix Developer").
2. CAREER OBJECTIVE: Write exactly 2-3 sentences. Mention the role and core technologies required by the JD. Emphasize transforming complex requirements into scalable, high-performance applications.
3. TECHNICAL SKILLS: Return exactly 3 rows/categories.
   - For Full-Stack / MERN: Row 1: "Front-End", Row 2: "Back-End", Row 3: "Tools & Platforms".
   - For Wix / Front-End: Row 1: "Wix Development" (or "Front-End"), Row 2: "Back-End", Row 3: "Tools & Platforms".
   - Front-load technologies that match the Job Description. DO NOT invent languages he doesn't know, but highlight overlapping tech (e.g., React, Next.js, TypeScript, JavaScript, Node.js, Express, PostgreSQL, NestJS, Tailwind CSS, REST APIs, Git, etc.).
4. PROJECT SELECTION: Select the 2 (or max 3) most relevant projects from the candidate's available projects.
   - Project Title: Keep original title, optionally add " — [Subtitle]" (e.g., "Property Management System — Next.js Full-Stack Application" or "Linda's Cakes & Catering — E-Commerce & Booking Platform").
   - Technologies: Comma-separated list tailored to the stack of the project and keywords in the JD.
   - Bullets: Provide exactly 3 bullet points per project.
     * Each bullet MUST begin with a strong past-tense action verb (Built, Engineered, Developed, Implemented, Designed, Automated, Optimized, Scaled).
     * Quantify impact wherever possible (~40%, 99.9%, real-time, 100+).
     * Incorporate key terminology from the Job Description.
5. KEEP FIXED: Education and Languages must remain exactly as given.

RESPONSE FORMAT:
You MUST return ONLY a valid raw JSON object (without markdown code fences, or wrapped in standard \`\`\`json \`\`\`).
The JSON structure MUST match:
{
  "header": {
    "name": "Md Moniruzzaman",
    "title": "string",
    "phone": "+8801979915165",
    "email": "alvinmonir411@gmail.com",
    "location": "Dhaka, Bangladesh (Open to Remote)",
    "portfolioDisplay": "alvinmonir.vercel.app",
    "portfolioUrl": "https://alvinmonir.vercel.app",
    "githubDisplay": "github.com/alvinmonir411",
    "githubUrl": "https://github.com/alvinmonir411",
    "linkedinDisplay": "www.linkedin.com/in/moniruzzaman13663",
    "linkedinUrl": "https://www.linkedin.com/in/moniruzzaman13663"
  },
  "careerObjective": "string",
  "technicalSkills": [
    { "category": "Front-End", "skills": "string" },
    { "category": "Back-End", "skills": "string" },
    { "category": "Tools & Platforms", "skills": "string" }
  ],
  "experience": {
    "enabled": boolean,
    "role": "Executive Front End",
    "company": "SM Technology",
    "duration": "1 year 1 month",
    "description": "string"
  },
  "projects": [
    {
      "title": "string",
      "liveUrl": "string",
      "clientSiteUrl": "string",
      "serverSiteUrl": "string",
      "technologies": "string",
      "bullets": ["string", "string", "string"]
    }
  ],
  "education": {
    "degree": "Bachelor of Social Science (BSS)",
    "expectedYear": "Expected 2028",
    "location": "Rangpur, Bangladesh"
  },
  "languages": "Bengali: Native | English: Comfortable | Hindi: Fluent"
}
`;

    for (const modelName of GEMINI_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: promptText }] }],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json",
              },
            }),
          }
        );
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            // Strip markdown block if returned
            rawText = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
            const parsed: ATSResumeData = JSON.parse(rawText);

            return NextResponse.json({
              success: true,
              resume: parsed,
              modelUsed: modelName,
            });
          }
        } else {
          console.warn(`Gemini model ${modelName} returned status ${response.status}`);
        }
      } catch (modelErr) {
        console.warn(`Gemini model ${modelName} failed, trying fallback:`, modelErr);
      }
    }

    // Fallback if all Gemini models failed
    const isWix =
      jobDescription.toLowerCase().includes("wix") ||
      jobDescription.toLowerCase().includes("velo");

    return NextResponse.json({
      success: true,
      resume: isWix ? WIX_FRONTEND_RESUME_TEMPLATE : FULLSTACK_RESUME_TEMPLATE,
      isFallback: true,
      note: "Fallback template returned due to AI service timeout.",
    });
  } catch (error: any) {
    console.error("Resume Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
