// supbaseStorageService
import { InternalServerErrorException } from '@nestjs/common';
import axios from "axios";
import { supabaseConfig } from "../../config/storage.config.ts";

const base = supabaseConfig.url;
const svc = supabaseConfig.serviceRole;

// Upload image to supabase bucket
export async function uploadBufferToSupabase(
  bucket: string,
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<{ path: string; publicUrl: string }> {
  // URL of Supabase API to store image
  const url = `${base}/storage/v1/object/${bucket}/${key}`;

  // Send API request to store the image at the bucket with the URL
  try {
    await axios.post(url, buffer, {
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${svc}`,
        apikey: svc,
        "x-upsert": "true",
      },
      maxBodyLength: Infinity,
    });
  } catch (e) {
    throw new InternalServerErrorException("Internal server error");
  }

  // Return the path of image (store in DB) and the public url
  const publicUrl = `${base}/storage/v1/object/public/${bucket}/${key}`;
  return { path: `${bucket}/${key}`, publicUrl };
}

// Delete an image from supabase bucket
export async function deleteFromSupabase(path: string): Promise<void> {
  // path = "<bucket>/<key>"
  const url = `${base}/storage/v1/object/${path}`;
  try {
    await axios.delete(url, {
      headers: { Authorization: `Bearer ${svc}`, apikey: svc },
    });
  } catch (e) {
    throw new InternalServerErrorException("Internal server error");
  }
}
