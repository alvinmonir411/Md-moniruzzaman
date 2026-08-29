"use server";

import sql from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function togglePinProject(id: string, is_featured: boolean) {
  try {
    const numId = Number(id);
    if (!numId) return { success: false, error: "Invalid project ID" };

    const result = await sql`
      UPDATE projects
      SET 
        is_featured = ${is_featured},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${numId}
      RETURNING id, title, is_featured;
    `;

    if (result.length === 0) {
      return { success: false, error: "Project not found" };
    }

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/admin/projects");

    return { 
      success: true, 
      is_featured: Boolean(result[0].is_featured),
      title: result[0].title
    };
  } catch (error) {
    console.error("Failed to toggle pin status:", error);
    return { success: false, error: "Failed to toggle pin status" };
  }
}
