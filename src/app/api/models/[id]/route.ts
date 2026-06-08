import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";
import { getClientBearerToken } from "@/lib/client/auth-request";

type RouteContext = { params: Promise<{ id: string }> };

function errorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    return String((data as { message: unknown }).message);
  }
  return fallback;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  const token = getClientBearerToken(_request);
  const { id } = await context.params;
  const { status, data } = await backendFetch(`/v1/users/${id}`, {
    token: token ?? undefined,
  });

  if (status !== 200) {
    return NextResponse.json(
      data ?? { message: errorMessage(data, "Failed to fetch model") },
      { status },
    );
  }

  return NextResponse.json(data);
}
