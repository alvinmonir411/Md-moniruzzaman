"use server";

import { getcloudinaryImageurl } from "@/app/lib/getcloudinaryImageurl";
import sql from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProject(formData: FormData) {
  try {
    const id = formData.get("_id") as string;
    if (!id) return { success: false, error: "Missing project ID" };

    // Handle Thumbnail
    const file = formData.get("thumbnail") as File;
    let imageUrl: string | undefined = undefined;
    if (file && file.size > 0) {
      imageUrl = await getcloudinaryImageurl(file);
    }

    // Handle Gallery Images
    const imageFiles = formData.getAll("images") as File[];
    const newUploadedImages: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
      for (const imgFile of imageFiles) {
        if (imgFile.size > 0) {
          const url = await getcloudinaryImageurl(imgFile);
          if (url) newUploadedImages.push(url);
        }
      }
    }

    // Handle Existing Images
    const existingImagesJson = formData.get("existingImages") as string;
    let existingImages: string[] = [];
    if (existingImagesJson) {
      try {
        existingImages = JSON.parse(existingImagesJson);
      } catch (e) {
        console.error("Failed to parse existing images", e);
      }
    }

    const finalImages = [...existingImages, ...newUploadedImages];

    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const tech = formData.get("tech") as string;
    const liveUrl = (formData.get("live") as string) || "";
    const githubUrl = (formData.get("github") as string) || "";
    const category = (formData.get("category") as string) || "custom";
    const isFeatured = formData.has("is_featured") ? formData.get("is_featured") === "true" : undefined;

    if (imageUrl) {
      await sql`
        UPDATE projects
        SET 
          title = ${title},
          description = ${desc},
          tech = ${tech},
          live_url = ${liveUrl},
          github_url = ${githubUrl},
          category = ${category},
          img = ${imageUrl},
          images = ${JSON.stringify(finalImages)}::jsonb,
          is_featured = COALESCE(${isFeatured}, is_featured),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${Number(id)};
      `;
    } else {
      await sql`
        UPDATE projects
        SET 
          title = ${title},
          description = ${desc},
          tech = ${tech},
          live_url = ${liveUrl},
          github_url = ${githubUrl},
          category = ${category},
          images = ${JSON.stringify(finalImages)}::jsonb,
          is_featured = COALESCE(${isFeatured}, is_featured),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${Number(id)};
      `;
    }

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to update project in Neon DB:", error);
    return { success: false, error: "Failed to update project" };
  }
}
