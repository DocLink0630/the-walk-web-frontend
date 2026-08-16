import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";
import { sanitizePublicServiceProvidersPayload } from "@/lib/public/plaintext-field";

export async function GET(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const { searchParams } = request.nextUrl;

  const { status, data } = await backendFetch("/v1/public/beauticians", {
    searchParams: {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "100",
      search: searchParams.get("search") ?? undefined,
    },
  });

  return NextResponse.json(sanitizePublicServiceProvidersPayload(data ?? {}), { status });
}
