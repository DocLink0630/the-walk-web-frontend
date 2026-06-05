/**
 * NestJS API base URL (no trailing slash).
 * Routes are under /v1/... — do not include /api unless your deploy actually prefixes it.
 */
export function getBackendUrl(): string {
  const raw = process.env.BACKEND_URL?.trim();
  if (!raw) {
    throw new Error("BACKEND_URL is not configured");
  }

  let url = raw.replace(/\/$/, "");

  // Railway/hosting often exposes the app at root with /v1; a stray /api breaks paths.
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }

  return url;
}

export function backendApiUrl(path: string): string {
  const base = getBackendUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
