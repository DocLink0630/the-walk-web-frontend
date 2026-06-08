import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";
import { getClientBearerToken } from "@/lib/client/auth-request";

function errorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    return String((data as { message: unknown }).message);
  }
  return fallback;
}

export async function GET(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  const token = getClientBearerToken(request);
  const { searchParams } = request.nextUrl;
  const roles = searchParams.get("roles") ?? JSON.stringify(["MODEL"]);

  const { status, data } = await backendFetch("/v1/users", {
    token: token ?? undefined,
    searchParams: {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "100",
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? "ACTIVE",
      roles,
    },
  });

  if (status !== 200) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to fetch models") },
      { status },
    );
  }

  return NextResponse.json(data);
}
