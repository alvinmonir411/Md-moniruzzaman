// AddSkill.ts
"use server";

import { getcloudinaryImageurl } from "@/app/lib/getcloudinaryImageurl";
import sql from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export default async function AddSkill(formData: FormData) {
  // 1. Get the File and Validate
  const file = formData.get("thumbnail") as File;

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("❌ Thumbnail image file is missing or invalid.");
  }

  // 2. Upload image to Cloudinary
  let imageUrl = "";
  try {
    imageUrl = await getcloudinaryImageurl(file);
    if (!imageUrl) {
      throw new Error("Cloudinary returned an empty URL.");
    }
  } catch (error) {
    console.error("❌ Cloudinary Upload Failed:", error);
    throw new Error("Image upload failed. Please try again.");
  }

  // 3. Extract other form data
  const title = formData.get("title") as string;
  const desc = formData.get("desc") as string;
  const techStack = formData.get("tech") as string;
  const liveUrl = (formData.get("live") as string) || "";
  const githubUrl = formData.get("github") as string;
  const challengesSolutions = formData.get("ChallengesSolutions") as string;
  const estimateTime = formData.get("EstimateTime") as string;

  // 4. Quick validation
  if (
    !title ||
    !desc ||
    !techStack ||
    !githubUrl ||
    !challengesSolutions ||
    !estimateTime
  ) {
    console.error("❌ Missing critical project details.");
    throw new Error(
      "Please fill in all required project fields (Title, Description, Tech Stack, GitHub URL, Challenges, and Time)."
    );
  }

  // 5. Insert to Neon DB
  try {
    await sql`
      INSERT INTO projects (
        title,
        description,
        tech,
        img,
        live_url,
        github_url,
        challenges_solutions,
        estimate_time,
        is_featured
      )
      VALUES (
        ${title},
        ${desc},
        ${techStack},
        ${imageUrl},
        ${liveUrl},
        ${githubUrl},
        ${challengesSolutions},
        ${estimateTime},
        false
      );
    `;

    // Revalidate the path where the project list is displayed
    revalidatePath("/");
  } catch (error) {
    console.error("❌ Neon DB insert failed:", error);
  }
}
