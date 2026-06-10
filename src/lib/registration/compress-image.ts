import imageCompression from "browser-image-compression";

const OPTIONS = {
  maxSizeMB: 1.5,
  maxWidthOrHeight: 1600,
  initialQuality: 0.82,
  fileType: "image/jpeg" as const,
  useWebWorker: true,
};

export async function compressImage(file: File): Promise<File> {
  if (file.size < 500_000) return file;
  try {
    return await imageCompression(file, OPTIONS);
  } catch {
    return file;
  }
}
