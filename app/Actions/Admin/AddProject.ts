"use server";

import { getcloudinaryImageurl } from "@/app/lib/getcloudinaryImageurl";
import sql from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function addProject(formData: FormData) {
  try {
    const file = formData.get("thumbnail") as File;
    let imageUrl = "";

    if (file && file.size > 0) {
      imageUrl = await getcloudinaryImageurl(file);
    }

    // Handle multiple images
    const imageFiles = formData.getAll("images") as File[];
    const uploadedImages: string[] = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const imgFile of imageFiles) {
        if (imgFile.size > 0) {
          const url = await getcloudinaryImageurl(imgFile);
          if (url) uploadedImages.push(url);
        }
      }
    }

    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const tech = formData.get("tech") as string;
    const liveUrl = (formData.get("live") as string) || "";
    const githubUrl = (formData.get("github") as string) || "";
    const category = (formData.get("category") as string) || "custom";
    const isFeatured = formData.get("is_featured") === "true";

    if (!title || !desc || !tech) {
      return { success: false, error: "Missing required fields (Title, Description, or Tech Stack)" };
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
        is_featured
      )
      VALUES (
        ${title}, 
        ${desc}, 
        ${tech}, 
        ${imageUrl}, 
        ${JSON.stringify(uploadedImages)}::jsonb, 
        ${liveUrl}, 
        ${githubUrl}, 
        ${category},
        ${isFeatured}
      )
      RETURNING id, title, description, tech, img, images, live_url as "liveUrl", github_url as "githubUrl", category, is_featured, created_at as "createdAt";
    `;

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");

    const created = result[0];

    return {
      success: true,
      project: {
        ...created,
        _id: String(created.id),
      },
    };
  } catch (error) {
    console.error("Failed to add project to Neon DB:", error);
    return { success: false, error: "Failed to add project" };
  }
}
