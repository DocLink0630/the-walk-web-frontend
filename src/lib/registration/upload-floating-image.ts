import { compressImage } from "./compress-image";

export async function uploadFloatingImage(
  file: File,
  onProgress?: () => void,
): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
  let compressed: File;
  try {
    compressed = await compressImage(file);
  } catch {
    compressed = file;
  }

  const formData = new FormData();
  formData.append("image", compressed, compressed.name || file.name);

  try {
    const res = await fetch("/api/public/uploads", {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(60_000),
    });

    let data: { token?: string; message?: string | string[] } = {};
    try {
      data = await res.json();
    } catch {
      /* ignore parse error */
    }

    if (!res.ok) {
      const msg = Array.isArray(data.message)
        ? data.message.join(" ")
        : data.message ?? `Upload failed (HTTP ${res.status})`;
      return { ok: false, message: msg };
    }

    if (!data.token) {
      return { ok: false, message: "Upload succeeded but no token was returned." };
    }

    onProgress?.();
    return { ok: true, token: data.token };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, message: `Unable to upload "${file.name}": ${msg}` };
  }
}
