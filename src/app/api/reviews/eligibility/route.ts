import { NextRequest, NextResponse } from "next/server";
import { getClientBearerToken } from "@/lib/client/auth-request";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";


export async function GET(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getClientBearerToken(request);
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const talentUserId = searchParams.get("talentUserId") ?? "";

  const { status, data } = await backendFetch("/v1/reviews/eligibility", {
    token,
    searchParams: { talentUserId },
  });

  return NextResponse.json(data ?? { message: "Unknown error" }, { status });
}
