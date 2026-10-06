export const ALLOWED_VIDEO_MIME = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
export const DEFAULT_PART_SIZE = 5_242_880; // 5 MB — backend always returns this

const PRESIGN_BATCH_SIZE = 10;
const PART_PUT_CONCURRENCY = 3;
const PART_PUT_MAX_ATTEMPTS = 3;

export type AllowedVideoMime = (typeof ALLOWED_VIDEO_MIME)[number];

export interface PortfolioVideoMeta {
  fileName: string;
  size: number;
}

export interface UploadPortfolioVideoOptions {
  onProgress?: (uploadedBytes: number, totalBytes: number) => void;
  signal?: AbortSignal;
}

type InitResponse = {
  uploadId: string;
  key: string;
  partSize: number;
  token: string;
};

type PresignResponse = {
  urls: Array<{ partNumber: number; url: string }>;
};

type CompleteResponse = {
  token: string;
};

type CompletedPart = {
  partNumber: number;
  etag: string;
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isAllowedMime(mime: string): mime is AllowedVideoMime {
  return (ALLOWED_VIDEO_MIME as readonly string[]).includes(mime);
}

function apiErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as { message: unknown }).message;
    if (typeof msg === "string") return msg;
    if (Array.isArray(msg)) return msg.join(" ");
  }
  return fallback;
}

function throwIfAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    const err = new Error("Upload cancelled");
    err.name = "AbortError";
    throw err;
  }
}

export function validatePortfolioVideo(
  file: File,
): { ok: true } | { ok: false; message: string } {
  if (!file || file.size <= 0) {
    return { ok: false, message: "Please choose a valid video file." };
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return {
      ok: false,
      message: "Video must be 200 MB or smaller.",
    };
  }
  if (!isAllowedMime(file.type)) {
    return {
      ok: false,
      message: "Only MP4, WebM, or QuickTime (MOV) videos are allowed.",
    };
  }
  return { ok: true };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatVideoSize(bytes: number): string {
  return formatBytes(bytes);
}

async function postJson<T>(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  throwIfAborted(signal);
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(apiErrorMessage(data, `Request failed (HTTP ${res.status})`));
  }

  return data as T;
}

async function abortMultipart(params: {
  key: string;
  uploadId: string;
  token: string;
}): Promise<void> {
  try {
    await postJson("/api/public/uploads/multipart/abort", params);
  } catch {
    /* best-effort */
  }
}

function extractEtag(res: Response): string {
  const raw = res.headers.get("etag") ?? res.headers.get("ETag");
  if (!raw) {
    throw new Error("S3 upload succeeded but ETag header was missing.");
  }
  return raw;
}

async function putPartWithRetry(
  url: string,
  chunk: Blob,
  signal?: AbortSignal,
): Promise<string> {
  let lastError = "Part upload failed";

  for (let attempt = 1; attempt <= PART_PUT_MAX_ATTEMPTS; attempt++) {
    throwIfAborted(signal);
    try {
      const res = await fetch(url, {
        method: "PUT",
        body: chunk,
        signal,
      });

      if (!res.ok) {
        lastError = `Part upload failed (HTTP ${res.status})`;
        const retryable =
          res.status === 408 || res.status === 429 || res.status >= 500;
        if (retryable && attempt < PART_PUT_MAX_ATTEMPTS) {
          await delay(1000 * attempt);
          continue;
        }
        throw new Error(lastError);
      }

      return extractEtag(res);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      lastError = err instanceof Error ? err.message : "Part upload failed";
      if (attempt < PART_PUT_MAX_ATTEMPTS) {
        await delay(1000 * attempt);
        continue;
      }
      throw new Error(lastError);
    }
  }

  throw new Error(lastError);
}

async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function runOne(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index]);
    }
  }

  const runners = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => runOne(),
  );
  await Promise.all(runners);
  return results;
}

/**
 * Multipart portfolio video upload. Returns the floating-file token from complete.
 */
export async function uploadPortfolioVideo(
  file: File,
  options: UploadPortfolioVideoOptions = {},
): Promise<string> {
  const validation = validatePortfolioVideo(file);
  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const { onProgress, signal } = options;
  const fileName = file.name || "portfolio-video.mp4";
  const mimeType = file.type;
  const size = file.size;

  let init: InitResponse | null = null;

  try {
    init = await postJson<InitResponse>(
      "/api/public/uploads/multipart/init",
      { fileName, mimeType, size },
      signal,
    );

    const partSize =
      typeof init.partSize === "number" && init.partSize > 0
        ? init.partSize
        : DEFAULT_PART_SIZE;

    const partCount = Math.ceil(size / partSize);
    const partNumbers = Array.from({ length: partCount }, (_, i) => i + 1);
    const completedParts: CompletedPart[] = [];
    const progress = { uploadedBytes: 0 };

    onProgress?.(0, size);

    for (let i = 0; i < partNumbers.length; i += PRESIGN_BATCH_SIZE) {
      throwIfAborted(signal);
      const batch = partNumbers.slice(i, i + PRESIGN_BATCH_SIZE);

      const presign = await postJson<PresignResponse>(
        "/api/public/uploads/multipart/presign",
        {
          key: init.key,
          uploadId: init.uploadId,
          partNumbers: batch,
        },
        signal,
      );

      const urlByPart = new Map(
        (presign.urls ?? []).map((u) => [u.partNumber, u.url]),
      );

      const batchResults = await runWithConcurrency(
        batch,
        PART_PUT_CONCURRENCY,
        async (partNumber) => {
          const url = urlByPart.get(partNumber);
          if (!url) {
            throw new Error(`Missing presigned URL for part ${partNumber}`);
          }
          const start = (partNumber - 1) * partSize;
          const end = Math.min(start + partSize, size);
          const chunk = file.slice(start, end);
          const etag = await putPartWithRetry(url, chunk, signal);
          progress.uploadedBytes += chunk.size;
          onProgress?.(Math.min(progress.uploadedBytes, size), size);
          return { partNumber, etag };
        },
      );

      completedParts.push(...batchResults);
    }

    completedParts.sort((a, b) => a.partNumber - b.partNumber);

    const complete = await postJson<CompleteResponse>(
      "/api/public/uploads/multipart/complete",
      {
        key: init.key,
        uploadId: init.uploadId,
        token: init.token,
        parts: completedParts,
        fileName,
        mimeType,
        size,
      },
      signal,
    );

    if (!complete.token) {
      throw new Error("Upload completed but no token was returned.");
    }

    onProgress?.(size, size);
    return complete.token;
  } catch (err) {
    if (init) {
      await abortMultipart({
        key: init.key,
        uploadId: init.uploadId,
        token: init.token,
      });
    }
    throw err;
  }
}

/** Result-style wrapper for callers that prefer ok/message. */
export async function uploadPortfolioVideoMultipart(
  file: File,
  options?: UploadPortfolioVideoOptions,
): Promise<{ ok: true; token: string } | { ok: false; message: string }> {
  try {
    const token = await uploadPortfolioVideo(file, options);
    return { ok: true, token };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, message: "Upload cancelled" };
    }
    const message =
      err instanceof Error ? err.message : "Unable to upload video";
    return { ok: false, message };
  }
}
