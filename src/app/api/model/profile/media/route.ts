import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

function getToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function POST(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getToken(request);
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const { status, data } = await backendFetch("/v1/users/me/media", {
    method: "POST",
    token,
    body,
  });

  return NextResponse.json(data ?? { message: "Unknown error" }, { status });
}
