const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export async function fetchImageDataUri(url: string): Promise<string | null> {
  if (!url?.trim()) return null;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength > MAX_IMAGE_BYTES) return null;

    const contentType = res.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function resolveImageDataUris(urls: string[]): Promise<string[]> {
  const limited = urls.filter(Boolean).slice(0, 12);
  const results = await Promise.all(limited.map((url) => fetchImageDataUri(url)));
  return results.filter((uri): uri is string => !!uri);
}
