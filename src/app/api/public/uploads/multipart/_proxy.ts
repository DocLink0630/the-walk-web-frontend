import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getBackendUrl } from "@/lib/backend/fetch";

export async function proxyMultipartPost(
  request: NextRequest,
  backendPath: string,
): Promise<NextResponse> {
  try {
    getBackendUrl();
  } catch {
    return NextResponse.json(
      { message: "BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { status, data } = await backendFetch(backendPath, {
    method: "POST",
    body,
  });

  return NextResponse.json(data ?? { message: "Request failed" }, { status });
}
