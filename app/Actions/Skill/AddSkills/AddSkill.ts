// AddSkill.ts (or AddSkill.js)
"use server";

import { getcloudinaryImageurl } from "@/app/lib/getcloudinaryImageurl";
import clientPromise from "@/app/lib/mongodb";
import { revalidatePath } from "next/cache";

// Ensure this matches your MongoDB configuration
const DATABASE_NAME = process.env.MONGODB_DB_NAME || "juwelary";

export default async function AddSkill(formData: FormData) {
  // 1. Get the File and Validate
  // Note: The file input name is 'thumbnail' as defined in AddSkills.jsx
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

  // 3. Extract other form data (using correct names)
  const title = formData.get("title") as string;
  const desc = formData.get("desc") as string;
  const techStack = formData.get("tech") as string;
  // liveUrl is optional in the form, so handle potentially empty string
  const liveUrl = (formData.get("live") as string) || "";
  const githubUrl = formData.get("github") as string;
  const challengesSolutions = formData.get("ChallengesSolutions") as string;
  const estimateTime = formData.get("EstimateTime") as string;

  // 4. Quick validation (Ensure critical fields are not empty)
  if (
    !title ||
    !desc ||
    !techStack ||
    !githubUrl ||
    !challengesSolutions ||
    !estimateTime
  ) {
    console.error("❌ Missing critical project details.");
    // Throwing a new Error provides a clearer message to the client-side/logs
    throw new Error(
      "Please fill in all required project fields (Title, Description, Tech Stack, GitHub URL, Challenges, and Time)."
    );
  }

  // 5. Insert to MongoDB
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const projectsCollection = db.collection("ProtfolioData");

    const newSkillData = {
      title: title,
      description: desc,
      tech: techStack,
      // Saving the Cloudinary URL here
      img: imageUrl,
      liveUrl: liveUrl,
      githubUrl: githubUrl,
      challengesSolutions: challengesSolutions,
      estimateTime: estimateTime,
      // Assuming default values for new project
      isfetured: false,
      createdAt: new Date(),
    };

    const result = await projectsCollection.insertOne(newSkillData);

    // Revalidate the path where the project list is displayed (e.g., the home page)
    revalidatePath("/");
  } catch (error) {
    console.error("❌ DB insert failed:", error);
  }
}
