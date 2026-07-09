import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export function uploadBuffer(buffer: Buffer, folder = "rapid-photo"): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed with no result"));
        
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    // Modern Node.js approach to pipeline buffer straight into the Cloudinary upload stream
    Readable.from(buffer).pipe(uploadStream);
  });
}

export function deleteImage(publicId: string): Promise<{ result: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result as { result: string });
    });
  });
}

export function deleteMultipleImages(publicIds: string[]): Promise<{ deleted: Record<string, string> }> {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(publicIds, (error, result) => {
      if (error) return reject(error);
      resolve(result as { deleted: Record<string, string> });
    });
  });
}
