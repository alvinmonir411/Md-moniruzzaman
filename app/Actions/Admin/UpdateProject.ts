"use server";

import { getcloudinaryImageurl } from "@/app/lib/getcloudinaryImageurl";
import clientPromise from "@/app/lib/mongodb";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

export async function updateProject(formData: FormData) {
    try {
        const id = formData.get("_id") as string;
        if (!id) return { success: false, error: "Missing project ID" };

        // Handle Thumbnail
        const file = formData.get("thumbnail") as File;
        let imageUrl = undefined;
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

        // Handle Existing Images (passed as JSON string of array)
        const existingImagesJson = formData.get("existingImages") as string;
        let existingImages: string[] = [];
        if (existingImagesJson) {
            try {
                existingImages = JSON.parse(existingImagesJson);
            } catch (e) {
                console.error("Failed to parse existing images", e);
            }
        }

        // Combine existing (kept) images with new uploads
        // If we want to *replace* the gallery, we might need a different strategy,
        // but typically "existing + new" is standard unless we strictly delete from existing.
        // The frontend will send the list of *kept* existing images.
        const finalImages = [...existingImages, ...newUploadedImages];

        const title = formData.get("title") as string;
        const desc = formData.get("desc") as string;
        const tech = formData.get("tech") as string;
        const liveUrl = formData.get("live") as string;
        const githubUrl = formData.get("github") as string;
        const category = formData.get("category") as string;

        const client = await clientPromise;
        const db = client.db("juwelary");
        const collection = db.collection("ProtfolioData");

        const updateData: any = {
            title,
            description: desc,
            tech: tech,
            liveUrl,
            githubUrl,
            category: category || "custom",
            images: finalImages,
            updatedAt: new Date(),
        };

        // Only update thumbnail if a new one was uploaded
        if (imageUrl) {
            updateData.img = imageUrl;
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return { success: false, error: "Project not found" };
        }

        revalidatePath("/admin/projects");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Failed to update project:", error);
        return { success: false, error: "Failed to update project" };
    }
}
