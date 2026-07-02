import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

function getToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function GET(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getToken(request);
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const talentUserId = searchParams.get("talentUserId") ?? "";

  const { status, data } = await backendFetch("/v1/reviews/eligibility", {
    token,
    searchParams: { talentUserId },
  });

  return NextResponse.json(data ?? { message: "Unknown error" }, { status });
}
