import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getBearerToken } from "@/lib/admin/auth-request";
import { backendFetch, errorMessage, getBackendUrl } from "@/lib/admin/backend";

export async function adminInquiriesProxy(
  request: NextRequest,
  path: string,
  options: { method?: string; body?: unknown } = {},
) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  let body = options.body;
  if (body === undefined && request.method !== "GET" && request.method !== "DELETE") {
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }
  }

  const { status, data } = await backendFetch(`/v1/admin/inquiries${path}`, {
    method: options.method ?? request.method,
    token,
    body,
    searchParams:
      request.method === "GET" && path === ""
        ? {
            ...Object.fromEntries(request.nextUrl.searchParams.entries()),
            sort: request.nextUrl.searchParams.get("sort") ?? "createdAt",
            order: request.nextUrl.searchParams.get("order") ?? "desc",
          }
        : undefined,
  });

  if (status >= 400) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Inquiries request failed") },
      { status },
    );
  }

  return NextResponse.json(data ?? {});
}
