import cloudinary from "./cloudinary";

export async function getcloudinaryImageurl(file: any): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";
    const base64Image = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "course-thumbnails",
      resource_type: "image",
    });

    return uploadResult.secure_url;
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error);
    throw new Error(error?.message || "Image upload to Cloudinary failed");
  }
}
