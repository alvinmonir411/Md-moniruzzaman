"use server";

import { getcloudinaryImageurl } from "@/app/lib/getcloudinaryImageurl";
import clientPromise from "@/app/lib/mongodb";
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
        const liveUrl = formData.get("live") as string;
        const githubUrl = formData.get("github") as string;
        const category = formData.get("category") as string;

        if (!title || !desc || !tech) {
            return { success: false, error: "Missing required fields (Title, Description, or Tech Stack)" };
        }

        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("ProtfolioData");

        const newProject = {
            title,
            description: desc,
            tech: tech, // Saving as string to match current DB format
            img: imageUrl,
            images: uploadedImages, // Array of gallery images
            liveUrl,
            githubUrl,
            category: category || "custom",
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newProject);

        revalidatePath("/admin/projects");
        revalidatePath("/");

        return {
            success: true,
            project: {
                ...newProject,
                _id: result.insertedId.toString(),
            },
        };
    } catch (error) {
        console.error("Failed to add project:", error);
        return { success: false, error: "Failed to add project" };
    }
}
