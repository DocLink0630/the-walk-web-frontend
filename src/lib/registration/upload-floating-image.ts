import { compressImage } from "./compress-image";

export async function uploadFloatingImage(
  file: File,
  onProgress?: () => void,
): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
  const compressed = await compressImage(file);

  const formData = new FormData();
  formData.append("image", compressed);

  try {
    const res = await fetch("/api/public/uploads", {
      method: "POST",
      body: formData,
    });

    const data = (await res.json()) as { token?: string; message?: string };

    if (!res.ok) {
      return {
        ok: false,
        message: data.message ?? "Failed to upload image",
      };
    }

    if (!data.token) {
      return { ok: false, message: "Upload succeeded but no token was returned." };
    }

    onProgress?.();
    return { ok: true, token: data.token };
  } catch {
    return { ok: false, message: "Unable to upload image. Please try again." };
  }
}
