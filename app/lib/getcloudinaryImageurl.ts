import { File } from "buffer";
import cloudinary from "./cloudinary";

export async function getcloudinaryImageurl(file: File | any): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

  const uploadResult = await cloudinary.uploader.upload(base64Image, {
    folder: "course-thumbnails",
    resource_type: "image",
  });

  return uploadResult.secure_url;
}
