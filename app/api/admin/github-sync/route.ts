import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/lib/db";
import cloudinary from "@/app/lib/cloudinary";
import { revalidatePath } from "next/cache";

const GITHUB_USERNAME = "alvinmonir411";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const inspectRepo = searchParams.get("inspectRepo");

    // If specific repo inspection requested
    if (inspectRepo) {
      let pkg: any = null;
      let readme = "";

      for (const branch of ["main", "master"]) {
        if (!pkg) {
          try {
            const pkgRes = await fetch(
              `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${inspectRepo}/${branch}/package.json`,
              { headers: { "User-Agent": "Portfolio-App" }, next: { revalidate: 60 } }
            );
            if (pkgRes.ok) pkg = await pkgRes.json();
          } catch (e) {}
        }
        if (!readme) {
          try {
            const readmeRes = await fetch(
              `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${inspectRepo}/${branch}/README.md`,
              { headers: { "User-Agent": "Portfolio-App" }, next: { revalidate: 60 } }
            );
            if (readmeRes.ok) readme = await readmeRes.text();
          } catch (e) {}
        }
      }

      return NextResponse.json({
        success: true,
        repo: inspectRepo,
        pkgName: pkg?.name,
        pkgDescription: pkg?.description,
        dependencies: pkg?.dependencies ? Object.keys(pkg.dependencies) : [],
        readmeSnippet: readme.slice(0, 1500),
      });
    }

    // 1. Fetch repositories from GitHub
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      {
        headers: {
          "User-Agent": "Portfolio-App",
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repositories from GitHub" },
        { status: res.status }
      );
    }

    const repos: GitHubRepo[] = await res.json();

    // 2. Fetch existing projects from database to check for duplicates
    let existingProjects: any[] = [];
    try {
      existingProjects = await sql`
        SELECT id, title, github_url as "githubUrl", live_url as "liveUrl" FROM projects;
      `;
    } catch (dbErr) {
      console.warn("Could not query existing projects for sync:", dbErr);
    }

    const existingGithubUrls = new Set(
      existingProjects
        .map((p) => (p.githubUrl || "").trim().toLowerCase())
        .filter(Boolean)
    );
    const existingTitles = new Set(
      existingProjects
        .map((p) => (p.title || "").trim().toLowerCase())
        .filter(Boolean)
    );

    // 3. Process & enrich repositories
    const formattedRepos = repos
      .filter((repo) => !repo.fork) // Exclude forks by default
      .map((repo) => {
        const repoLowerUrl = (repo.html_url || "").toLowerCase();
        const repoLowerName = (repo.name || "").toLowerCase();

        const matchingProject = existingProjects.find(
          (p) =>
            (p.githubUrl && p.githubUrl.toLowerCase() === repoLowerUrl) ||
            (p.title && p.title.toLowerCase() === repoLowerName)
        );

        const isAlreadyImported =
          Boolean(matchingProject) ||
          existingGithubUrls.has(repoLowerUrl) ||
          existingTitles.has(repoLowerName);

        // Clean & formatted title
        const cleanTitle = repo.name
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        // Tech stack compilation
        const techList: string[] = [];
        if (repo.language) techList.push(repo.language);
        if (Array.isArray(repo.topics)) {
          repo.topics.forEach((t) => {
            if (!techList.includes(t)) {
              techList.push(t.charAt(0).toUpperCase() + t.slice(1));
            }
          });
        }
        if (techList.length === 0) techList.push("TypeScript", "React");

        // Live preview / screenshot generation
        const hasLiveUrl =
          Boolean(repo.homepage) &&
          (repo.homepage!.startsWith("http://") || repo.homepage!.startsWith("https://"));

        const liveScreenshotUrl = hasLiveUrl
          ? `https://api.microlink.io/?url=${encodeURIComponent(
              repo.homepage!
            )}&screenshot=true&meta=false&embed=screenshot.url`
          : null;

        const socialPreviewUrl = `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`;

        // Default thumbnail
        const defaultThumbnail = liveScreenshotUrl || socialPreviewUrl;

        return {
          id: repo.id,
          name: repo.name,
          title: `${cleanTitle} — Full-Stack Platform`,
          description:
            repo.description ||
            `Modern ${techList[0] || "full-stack"} web application built with clean architecture, responsive design, and seamless performance.`,
          tech: techList.join(", "),
          techArray: techList,
          githubUrl: repo.html_url,
          liveUrl: repo.homepage || "",
          hasLiveUrl,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: repo.updated_at,
          screenshotUrl: liveScreenshotUrl,
          socialPreviewUrl,
          defaultThumbnail,
          isAlreadyImported,
          importedProjectId: matchingProject?.id ? String(matchingProject.id) : null,
        };
      });

    return NextResponse.json({
      success: true,
      username: GITHUB_USERNAME,
      totalRepos: formattedRepos.length,
      repositories: formattedRepos,
    });
  } catch (error: any) {
    console.error("Error in github-sync GET:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to scan GitHub repositories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let {
      title,
      description,
      tech,
      img,
      liveUrl,
      githubUrl,
      category = "custom",
      isFeatured = false,
      challengesSolutions = "",
      estimateTime = "",
      uploadToCloudinary = true,
      autoEnhanceWithAI = true,
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Project title is required" },
        { status: 400 }
      );
    }

    // Optional: Auto-enhance with AI Codebase Inspection if enabled and available
    if (autoEnhanceWithAI && githubUrl) {
      try {
        const aiRes = await fetch(`${request.nextUrl.origin}/api/admin/generate-project-ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, githubUrl, liveUrl, tech }),
        });
        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          if (aiJson.success && aiJson.data) {
            title = aiJson.data.title || title;
            description = aiJson.data.description || description;
            tech = aiJson.data.tech || tech;
            if (aiJson.data.challengesSolutions) {
              challengesSolutions = aiJson.data.challengesSolutions;
            }
          }
        }
      } catch (aiErr) {
        console.warn("AI Auto-Enhance skipped during import:", aiErr);
      }
    }

    let finalImageUrl = img || "";

    // If a preview URL is provided and uploadToCloudinary is enabled, save it to Cloudinary
    if (
      uploadToCloudinary &&
      finalImageUrl &&
      (finalImageUrl.startsWith("http://") || finalImageUrl.startsWith("https://")) &&
      !finalImageUrl.includes("res.cloudinary.com")
    ) {
      try {
        const uploadResult = await cloudinary.uploader.upload(finalImageUrl, {
          folder: "portfolio-projects",
          resource_type: "image",
        });
        if (uploadResult?.secure_url) {
          finalImageUrl = uploadResult.secure_url;
        }
      } catch (cloudErr) {
        console.warn("Failed to upload screenshot to Cloudinary, falling back to original URL:", cloudErr);
      }
    }

    const result = await sql`
      INSERT INTO projects (
        title,
        description,
        tech,
        img,
        images,
        live_url,
        github_url,
        category,
        challenges_solutions,
        estimate_time,
        is_featured
      )
      VALUES (
        ${title},
        ${description || ""},
        ${typeof tech === "string" ? tech : Array.isArray(tech) ? tech.join(", ") : ""},
        ${finalImageUrl},
        ${JSON.stringify(finalImageUrl ? [finalImageUrl] : [])}::jsonb,
        ${liveUrl || ""},
        ${githubUrl || ""},
        ${category},
        ${challengesSolutions || ""},
        ${estimateTime || ""},
        ${Boolean(isFeatured)}
      )
      RETURNING id, title, description, tech, img, live_url as "liveUrl", github_url as "githubUrl", category, is_featured as "isFeatured", created_at as "createdAt";
    `;

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");

    const created = result[0];

    return NextResponse.json(
      {
        success: true,
        message: `Project "${title}" analyzed & imported successfully!`,
        project: {
          ...created,
          _id: String(created.id),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error approving and importing GitHub project:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to import project" },
      { status: 500 }
    );
  }
}
