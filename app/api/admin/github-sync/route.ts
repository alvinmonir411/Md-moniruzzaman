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

export async function GET() {
  try {
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

        // Default thumbnail: use live screenshot if homepage is available, else GitHub open graph preview
        const defaultThumbnail = liveScreenshotUrl || socialPreviewUrl;

        return {
          id: repo.id,
          name: repo.name,
          title: cleanTitle,
          description:
            repo.description ||
            `Modern ${techList[0] || "full-stack"} web application built with clean architecture and responsive UI.`,
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

    const {
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
    } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Project title is required" },
        { status: 400 }
      );
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
        message: `Project "${title}" approved and imported successfully!`,
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
