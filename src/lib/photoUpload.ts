import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

export const MAX_PHOTOS = 10;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const SELL_BUCKET = "sell-requests";
const MAX_DIMENSION = 1920;

export function validatePhoto(file: File): string | null {
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) return `${file.name}: only JPG, PNG or WEBP images are allowed`;
  if (file.size > MAX_PHOTO_BYTES) return `${file.name}: larger than 10 MB`;
  return null;
}

/** Downscale large photos in the browser so uploads are fast on mobile data. */
async function compress(file: File): Promise<Blob> {
  if (typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.82));
    return blob ?? file;
  } catch {
    return file;
  }
}

/**
 * Uploads seller photos to the public `sell-requests` bucket and returns their
 * public URLs (which are included in the enquiry email). Failures are reported
 * back rather than thrown so the enquiry itself still goes through.
 */
export async function uploadSellPhotos(files: File[], reference: string) {
  const urls: string[] = [];
  let failed = 0;
  if (!isSupabaseConfigured || files.length === 0) return { urls, failed: files.length };

  await Promise.all(
    files.slice(0, MAX_PHOTOS).map(async (file, i) => {
      try {
        const blob = await compress(file);
        const ext = blob.type === "image/jpeg" ? "jpg" : file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${reference}/${String(i + 1).padStart(2, "0")}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
        const { error } = await supabase.storage
          .from(SELL_BUCKET)
          .upload(path, blob, { contentType: blob.type || file.type, upsert: false });
        if (error) throw error;
        urls[i] = supabase.storage.from(SELL_BUCKET).getPublicUrl(path).data.publicUrl;
      } catch (e) {
        failed += 1;
        if (import.meta.env.DEV) console.warn("[photos] upload failed", e);
      }
    }),
  );
  return { urls: urls.filter(Boolean), failed };
}
