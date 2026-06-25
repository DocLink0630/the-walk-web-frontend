import { compressImage } from "./compress-image";

const UPLOAD_TIMEOUT_MS = 120_000;
const MAX_ATTEMPTS = 3;

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  let lastError = "Upload failed";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch("/api/public/uploads", {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
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
        lastError = msg;

        if (isRetryableStatus(res.status) && attempt < MAX_ATTEMPTS) {
          await delay(1000 * attempt);
          continue;
        }
        return { ok: false, message: msg };
      }

      if (!data.token) {
        return { ok: false, message: "Upload succeeded but no token was returned." };
      }

      onProgress?.();
      return { ok: true, token: data.token };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      lastError = msg;

      if (attempt < MAX_ATTEMPTS) {
        await delay(1000 * attempt);
        continue;
      }

      if (/timeout|timed out|aborted/i.test(msg)) {
        return {
          ok: false,
          message: `Upload timed out for "${file.name}" — connection may be slow. Try again on a stronger network.`,
        };
      }
      return { ok: false, message: `Unable to upload "${file.name}": ${msg}` };
    }
  }

  return { ok: false, message: `Unable to upload "${file.name}": ${lastError}` };
}
