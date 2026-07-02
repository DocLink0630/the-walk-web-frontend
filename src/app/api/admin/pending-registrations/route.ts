import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/lib/admin/auth-request";
import { backendFetch, getBackendUrl } from "@/lib/admin/backend";

export async function GET(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { status, data } = await backendFetch("/v1/users/pending-registration-counts", {
    token,
  });

  return NextResponse.json(data ?? { message: "Unknown error" }, { status });
}
