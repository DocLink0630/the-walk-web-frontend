import imageCompression from "browser-image-compression";

const MAX_SIZE_MB = 1.2;
const MAX_DIMENSION = 1920;

export async function compressImage(file: File): Promise<File> {
  // Always compress — even small files may have large decoded sizes or
  // non-JPEG formats that swell on the wire.
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: MAX_SIZE_MB,
      maxWidthOrHeight: MAX_DIMENSION,
      initialQuality: 0.8,
      fileType: "image/jpeg",
      useWebWorker: true,
    });
    // Only use the compressed result if it actually made the file smaller.
    return compressed.size < file.size ? compressed : file;
  } catch {
    return file;
  }
}
