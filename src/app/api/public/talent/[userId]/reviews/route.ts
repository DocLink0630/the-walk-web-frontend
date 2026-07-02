import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const { userId } = await params;

  const { status, data } = await backendFetch(`/v1/public/talent/${userId}/reviews`);

  return NextResponse.json(data ?? { message: "Unknown error" }, { status });
}
