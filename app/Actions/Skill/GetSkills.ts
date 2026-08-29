"use server";

import sql from "@/app/lib/db";

export async function getAllTheProjects() {
  try {
    if (!process.env.DATABASE_URL) return [];

    const projects = await sql`
      SELECT 
        id as _id,
        title,
        description as desc,
        description,
        tech,
        img,
        images,
        live_url as "liveUrl",
        github_url as "githubUrl",
        category,
        challenges_solutions as "challengesSolutions",
        estimate_time as "estimateTime",
        is_featured as "isFeatured",
        is_featured as "is_featured",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM projects
      ORDER BY id DESC;
    `;

    return projects.map((project: any) => ({
      ...project,
      _id: String(project._id),
      is_featured: Boolean(project.is_featured || project.isFeatured),
      isFeatured: Boolean(project.is_featured || project.isFeatured),
      createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
    }));
  } catch (error) {
    console.error("❌ Failed to fetch projects from Neon DB:", error);
    return [];
  }
}
