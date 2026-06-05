import { backendApiUrl, getBackendUrl } from "@/lib/backend/url";

export { getBackendUrl };

export interface BackendFetchOptions {
  method?: string;
  token?: string;
  body?: unknown;
  searchParams?: Record<string, string | undefined>;
}

export interface BackendFetchResult {
  status: number;
  data: unknown;
}

export async function backendFetch(
  path: string,
  options: BackendFetchOptions = {},
): Promise<BackendFetchResult> {
  const url = new URL(backendApiUrl(path));

  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value);
      }
    }
  }

  const headers: Record<string, string> = {};
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: options.method ?? "GET",
      headers,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Backend unreachable";
    return { status: 502, data: { message } };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = { message: response.statusText || "Unknown error" };
  }

  return { status: response.status, data };
}

export function errorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as { message: unknown }).message;
    if (typeof msg === "string") return msg;
    if (Array.isArray(msg)) return msg.join(", ");
  }
  return fallback;
}
