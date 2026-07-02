import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/admin/backend";
import { getBearerToken } from "@/lib/admin/auth-request";

export async function GET(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getBearerToken(request);
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { searchParams } = request.nextUrl;

  const { status, data } = await backendFetch("/v1/reviews/admin", {
    token,
    searchParams: {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "20",
    },
  });

  return NextResponse.json(data ?? { message: "Unknown error" }, { status });
}
