import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

function errorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    return String((data as { message: unknown }).message);
  }
  return fallback;
}

/**
 * Proxies Swagger GET /v1/public/models — public roster, no auth required.
 */
export async function GET(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = request.nextUrl;

  const { status: backendStatus, data } = await backendFetch("/v1/public/models", {
    searchParams: {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "100",
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? "ACTIVE",
      roles: searchParams.get("roles") ?? JSON.stringify(["MODEL"]),
    },
  });

  if (backendStatus !== 200) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to fetch models") },
      { status: backendStatus },
    );
  }

  return NextResponse.json(data);
}
