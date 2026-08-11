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
  const { status, data } = await backendFetch("/v1/inquiries", {
    token,
    searchParams: {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "20",
    },
  });

  return NextResponse.json(data ?? { message: "Unknown error" }, { status });
}

export async function POST(request: NextRequest) {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json({ message: "BACKEND_URL is not configured" }, { status: 500 });
  }

  const token = getClientBearerToken(request);
  if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const { status, data } = await backendFetch("/v1/inquiries", {
    method: "POST",
    token,
    body,
  });

  return NextResponse.json(data ?? { message: "Unknown error" }, { status });
}
