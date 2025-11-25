// app/lib/cloudinaryConfig.ts

import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
  // ✅ FIX: Process.env call-ke standard name diye change kora
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
